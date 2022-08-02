/ *! jQuery UI - v1.12.1 - 2016-09-14
* http://jqueryui.com
* Inclui: widget.js, position.js, data.js, disable-selection.js, efeito.js, efeitos / efeito-blind.js, efeitos / efeito-bounce.js, efeitos / efeito-clip.js, efeitos /effect-drop.js, efeitos / efeito-explode.js, efeitos / efeito-fade.js, efeitos / efeitos-fold.js, efeitos / efeito-destaque.js, efeitos / efeito-puff.js, efeitos / efeito -pulsate.js, efeitos / efeitos-scale.js, efeitos / efeitos-efeitos.js, efeitos / efeitos-tamanho.js, efeitos / efeitos-efeitos.js, efeitos / efeitos-transferência.js, focusable.js, forma -reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets / accordion.js, widgets / autocomplete.js , widgets / button.js, widgets / checkboxradio.js, widgets / controlgroup.js, widgets / datepicker.js, widgets / dialog.js, widgets / draggable.js, widgets / droppable.js, widgets / menu.js, widgets /mouse.js, widgets / progressbar.js, widgets / redimensionáveis.js, widgets / selectable.js, widgets / selectmenu.js, widgets / slider.js, widgets / sortable.js, widgets / spinner.js, widgets / tabs.js, widgets / tooltip.js
* Copyright jQuery Foundation e outros colaboradores; MIT licenciado * /

(função (fábrica) {
	if (typeof define === "função" && define.amd) {

		// AMD. Registre-se como um módulo anônimo.
		define (["jquery"], fábrica);
	} outro {

		// Globais do navegador
		factory (jQuery);
	}
} (função ($) {

$ .ui = $ .ui || {};

var version = $ .ui.version = "1.12.1";


/ *!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Widget
// >> group: Core
// >> description: Fornece uma fábrica para criar widgets com estado com uma API comum.
// >> docs: http://api.jqueryui.com/jQuery.widget/
// >> demos: http://jqueryui.com/widget/



var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$ .cleanData = (function (orig) {
	função de retorno (elems) {
		var eventos, elem, i;
		para (i = 0; (elem = elems [i])! = nulo; i ++) {
			experimentar {

				// Somente disparar quando necessário para economizar tempo
				eventos = $ ._ dados (elem, "eventos");
				if (eventos e eventos.remove) {
					$ (elem) .triggerHandler ("remove");
				}

			// Http://bugs.jquery.com/ticket/8235
			} pegar (e) {}
		}
		orig (elems);
	};
}) ($ .cleanData);

$ .widget = function (nome, base, protótipo) {
	var existingConstructor, construtor, basePrototype;

	// ProxiedPrototype permite que o protótipo fornecido permaneça sem modificações
	// para que possa ser usado como um mixin para múltiplos widgets (# 8876)
	var proxiedPrototype = {};

	var namespace = name.split (".") [0];
	name = name.split (".") [1];
	var fullName = namespace + "-" + nome;

	if (! protótipo) {
		protótipo = base;
		base = $ .Widget;
	}

	if ($ .isArray (protótipo)) {
		prototype = $ .extend.apply (null, [{}] .concat (protótipo));
	}

	// Cria o seletor para o plugin
	$ .expr [":"] [fullName.toLowerCase ()] = function (elem) {
		return !! $. data (elem, fullName);
	};

	$ [namespace] = $ [namespace] || {};
	existingConstructor = $ [namespace] [nome];
	construtor = $ [namespace] [name] = function (options, element) {

		// Permitir instanciação sem a palavra-chave "new"
		if (! this._createWidget) {
			return new constructor (opções, elemento);
		}

		// Permitir instanciação sem inicializar para herança simples
		// deve usar a palavra-chave "new" (o código acima sempre passa args)
		if (argument.length) {
			this._createWidget (options, element);
		}
	};

	// Estender com o construtor existente para transportar quaisquer propriedades estáticas
	$ .extend (construtor, existingConstructor, {
		versão: prototype.version,

		// Copie o objeto usado para criar o protótipo no caso de precisarmos
		// redefine o widget mais tarde
		_proto: $ .extend ({}, protótipo),

		// Rastrear widgets que herdam desse widget, caso esse widget seja
		// redefinido depois que um widget herda dele
		_childConstructors: []
	});

	basePrototype = nova base ();

	// Precisamos tornar as opções hash uma propriedade diretamente na nova instância
	// caso contrário, modificaremos o hash de opções no protótipo que estamos
	// herdando de
	basePrototype.options = $ .widget.extend ({}, basePrototype.options);
	$ .each (protótipo, função (prop, valor) {
		if (! $. isFunction (value)) {
			proxiedPrototype [prop] = valor;
			Retorna;
		}
		proxiedPrototype [prop] = (function () {
			função _super () {
				return base.prototype [prop] .apply (isso, argumentos);
			}

			function _superApply (args) {
				return base.prototype [prop] .apply (isso, args);
			}

			função de retorno () {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply (isto, argumentos);

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		}) ();
	});
	constructor.prototype = $ .widget.extend (basePrototype, {

		// TODO: remove o suporte para widgetEventPrefix
		// sempre use o nome + dois-pontos como o prefixo, por exemplo, arrastável: start
		// não prefixar os widgets que não são baseados em DOM
		widgetEventPrefix: existingConstructor? (basePrototype.widgetEventPrefix || name): nome
	}, proxiedPrototype, {
		construtor: construtor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// Se este widget está sendo redefinido, precisamos encontrar todos os widgets que
	// estão herdando dele e redefinindo todos eles para que eles herdem
	// a nova versão deste widget. Estamos essencialmente tentando substituir um
	// level na cadeia de protótipos.
	if (existingConstructor) {
		$ .each (existingConstructor._childConstructors, function (i, child) {
			var childPrototype = child.prototype;

			// Redefina o widget filho usando o mesmo protótipo que foi
			// originalmente usado, mas herdado da nova versão da base
			$ .widget (childPrototype.namespace + "." + childPrototype.widgetName, construtor,
				child._proto);
		});

		// Remove a lista de construtores filhos existentes do construtor antigo
		// para que os construtores filhos antigos possam ser coletados com lixo
		delete existingConstructor._childConstructors;
	} outro {
		base._childConstructors.push (construtor);
	}

	$ .widget.bridge (nome, construtor);

	construtor de retorno;
};

$ .widget.extend = function (target) {
	var input = widgetSlice.call (argumentos, 1);
	var inputIndex = 0;
	var inputLength = input.length;
	var chave;
	valor var;

	para (; inputIndex <inputLength; inputIndex ++) {
		para (chave na entrada [inputIndex]) {
			value = input [inputIndex] [chave];
			if (input [inputIndex] .hasOwnProperty (key) && valor! == indefinido) {

				// Clone objetos
				if ($ .isPlainObject (value)) {
					target [key] = $ .isPlainObject (target [key])?
						$ .widget.extend ({}, target [key], value):

						// Não estenda cadeias de caracteres, matrizes, etc. com objetos
						$ .widget.extend ({}, valor);

				// Copie todo o resto por referência
				} outro {
					target [chave] = valor;
				}
			}
		}
	}
	meta de retorno;
};

$ .widget.bridge = function (name, object) {
	var fullName = object.prototype.widgetFullName || nome;
	$ .fn [nome] = função (opções) {
		var isMethodCall = tipo de opções === "string";
		var args = widgetSlice.call (argumentos, 1);
		var returnValue = isto;

		if (isMethodCall) {

			// Se esta é uma coleção vazia, precisamos ter o método da instância
			// retorna undefined ao invés da instância jQuery
			if (! this.length && options === "instance") {
				returnValue = indefinido;
			} outro {
				this.each (function () {
					var methodValue;
					var instance = $ .data (isso, fullName);

					if (opções === "instance") {
						returnValue = instância;
						retorna falso;
					}

					if (! instance) {
						return $ .error ("não pode chamar métodos em" + nome +
							"antes da inicialização;"
							"tentou chamar o método '" + opções + "'";
					}

					if (! $. isFunction (instance [opções]) || options.charAt (0) === "_") {
						return $ .error ("nenhum tal método" "+ opções +" 'para "+ nome +
							"instância de widget");
					}

					methodValue = instance [opções] .apply (instance, args);

					if (methodValue! == instance && methodValue! == undefined) {
						returnValue = methodValue && methodValue.jquery?
							returnValue.pushStack (methodValue.get ()):
							methodValue;
						retorna falso;
					}
				});
			}
		} outro {

			// Permitir que múltiplos hashes sejam passados ​​no init
			if (args.length) {
				opções = $ .widget.extend.apply (null, [opções] .concat (args));
			}

			this.each (function () {
				var instance = $ .data (isso, fullName);
				if (instance) {
					instance.option (opções || {});
					if (instance._init) {
						instance._init ();
					}
				} outro {
					$ .data (this, fullName, novo objeto (opções, isto));
				}
			});
		}

		return returnValue;
	};
};

$ .Widget = function (/ * options, element * /) {};
$ .Widget._childConstructors = [];

$ .Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	opções: {
		classes: {},
		desativado: falso

		// Callbacks
		criar: null
	}

	_createWidget: function (options, element) {
		element = $ (elemento || this.defaultElement || isto) [0];
		this.element = $ (elemento);
		this.uuid = widgetUuid ++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $ ();
		this.hoverable = $ ();
		this.focusable = $ ();
		this.classesElementLookup = {};

		if (elemento! == isso) {
			$ .data (element, this.widgetFullName, this);
			this._on (true, this.element, {
				remove: function (event) {
					if (event.target === elemento) {
						this.destroy ();
					}
				}
			});
			this.document = $ (element.style?

				// Elemento dentro do documento
				element.ownerDocument:

				// Elemento é janela ou documento
				element.document || elemento );
			this.window = $ (this.document [0] .defaultView || this.document [0] .parentWindow);
		}

		this.options = $ .widget.extend ({},
			this.options,
			this._getCreateOptions (),
			opções);

		this._create ();

		if (this.options.disabled) {
			this._setOptionDisabled (this.options.disabled);
		}

		this._trigger ("criar", nulo, this._getCreateEventData ());
		this._init ();
	}

	_getCreateOptions: function () {
		Retorna {};
	}

	_getCreateEventData: $ .noop,

	_create: $ .noop,

	_init: $ .noop,

	destroy: function () {
		var isso = isto;

		this._destroy ();
		$ .each (this.classesElementLookup, function (key, value) {
			that._removeClass (valor, chave);
		});

		// Provavelmente podemos remover as chamadas desvinculadas em 2.0
		// todas as ligações de eventos devem passar por this._on ()
		this.element
			.off (this.eventNamespace)
			.removeData (this.widgetFullName);
		this.widget ()
			.off (this.eventNamespace)
			.removeAttr ("aria-disabled");

		// Limpar eventos e estados
		this.bindings.off (this.eventNamespace);
	}

	_destroy: $ .noop,

	widget: function () {
		retornar this.element;
	}

	opção: function (key, value) {
		var options = key;
		var peças;
		var curOption;
		var i;

		if (arguments.length === 0) {

			// Não retorne uma referência ao hash interno
			return $ .widget.extend ({}, this.options);
		}

		if (tipo de chave === "string") {

			// Lidar com chaves aninhadas, por exemplo, "foo.bar" => {foo: {bar: ___}}
			opções = {};
			parts = key.split (".");
			key = parts.shift ();
			if (parts.length) {
				curOption = opções [chave] = $ .widget.extend ({}, this.options [key]);
				para (i = 0; i <parts.length - 1; i ++) {
					curOption [partes [i]] = curOption [partes [i]] || {};
					curOption = curOption [partes [i]];
				}
				key = parts.pop ();
				if (arguments.length === 1) {
					retornar curOption [key] === indefinido? null: curOption [chave];
				}
				curOption [chave] = valor;
			} outro {
				if (arguments.length === 1) {
					return this.options [chave] === indefinido? null: this.options [chave];
				}
				opções [chave] = valor;
			}
		}

		this._setOptions (opções);

		devolva isto;
	}

	_setOptions: function (options) {
		var chave;

		for (key in options) {
			this._setOption (chave, opções [chave]);
		}

		devolva isto;
	}

	_setOption: function (key, value) {
		if (key === "classes") {
			this._setOptionClasses (valor);
		}

		this.options [chave] = valor;

		if (chave === "desativado") {
			this._setOptionDisabled (valor);
		}

		devolva isto;
	}

	_setOptionClasses: function (value) {
		var classKey, elements, currentElements;

		para (classKey em valor) {
			currentElements = this.classesElementLookup [classKey];
			if (valor [classKey] === this.options.classes [classKey] ||
					! currentElements ||
					! currentElements.length) {
				continuar;
			}

			// Estamos fazendo isso para criar um novo objeto jQuery porque a chamada _removeClass ()
			// na próxima linha vai destruir a referência aos elementos atuais sendo
			// monitorados. Precisamos salvar uma cópia dessa coleção para que possamos adicionar as novas classes
			// abaixo.
			elementos = $ (currentElements.get ());
			this._removeClass (currentElements, classKey);

			// Não usamos _addClass () aqui, porque isso usa this.options.classes
			// para gerar a string de classes. Queremos usar o valor passado de
			// _setOption (), este é o novo valor da opção de classes que foi passada para
			// _setOption (). Nós passamos este valor diretamente para _classes ().
			elements.addClass (this._classes ({
				elemento: elementos,
				chaves: classKey,
				classes: valor,
				adicionar: true
			}));
		}
	}

	_setOptionDisabled: function (value) {
		this._toggleClass (this.widget (), this.widgetFullName + "-desativado", valor nulo, !!);

		// Se o widget está se tornando desativado, nada é interativo
		if (valor) {
			this._removeClass (this.hoverable, null, "ui-state-hover");
			this._removeClass (this.focusable, null, "ui-state-focus");
		}
	}

	enable: function () {
		return this._setOptions ({disabled: false});
	}

	disable: function () {
		return this._setOptions ({disabled: true});
	}

	_classes: function (options) {
		var full = [];
		var isso = isto;

		opções = $ .extend ({
			elemento: this.element,
			classes: this.options.classes || {}
		}, opções);

		function processClassString (classes, checkOption) {
			var corrente, i;
			para (i = 0; i <classes.length; i ++) {
				current = that.classesElementLookup [classes [i]] || $ ();
				if (options.add) {
					current = $ ($ .unique (current.get (). concat (options.element.get ())));
				} outro {
					current = $ (current.not (options.element) .get ());
				}
				that.classesElementLookup [classes [i]] = atual;
				full.push (classes [i]);
				if (checkOption && options.classes [classes [i]]) {
					full.push (options.classes [classes [i]]);
				}
			}
		}

		this._on (options.element, {
			"remove": "_untrackClassesElement"
		});

		if (options.keys) {
			processClassString (options.keys.match (/ \ S + / g) || [], true);
		}
		if (options.extra) {
			processClassString (options.extra.match (/ \ S + / g) || []);
		}

		return full.join ("");
	}

	_untrackClassesElement: function (event) {
		var isso = isto;
		$ .each (that.classesElementLookup, function (key, value) {
			if ($ .inArray (event.target, value)! == -1) {
				that.classesElementLookup [key] = $ (value.not (event.target) .get ());
			}
		});
	}

	_removeClass: function (elemento, chaves, extra) {
		return this._toggleClass (elemento, chaves, extra, false);
	}

	_addClass: function (elemento, chaves, extra) {
		return this._toggleClass (elemento, chaves, extra, true);
	}

	_toggleClass: function (elemento, chaves, extra, adicionar) {
		add = (typeof add === "booleano")? adicione: extra;
		var shift = (tipo de elemento === "string" || elemento === null),
			options = {
				extra: turno chaves: extra
				chaves: shift? elemento: chaves,
				elemento: shift? this.element: elemento,
				adicionar: adicionar
			};
		options.element.toggleClass (this._classes (opções), add);
		devolva isto;
	}

	_on: function (suppressDisabledCheck, element, handlers) {
		var delegateElement;
		var instance = this;

		// Nenhum sinalizador suppressDisabledCheck, argumentos aleatórios
		if (typeof suppressDisabledCheck! == "booleano") {
			manipuladores = elemento;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// Nenhum argumento de elemento, shuffle e use this.element
		if (! handlers) {
			manipuladores = elemento;
			element = this.element;
			delegateElement = this.widget ();
		} outro {
			element = delegateElement = $ (elemento);
			this.bindings = this.bindings.add (elemento);
		}

		$ .each (handlers, function (event, handler) {
			function handlerProxy () {

				// Permitir que widgets personalizem o tratamento desativado
				// - desativado como uma matriz em vez de booleano
				// - classe desativada como método para desativar partes individuais
				if (! suppressDisabledCheck &&
						(instance.options.disabled === true ||
						$ (this) .hasClass ("ui-state-disabled"))) {
					Retorna;
				}
				return (manipulador de tipos === "string"? instance [handler]: manipulador)
					.apply (instância, argumentos);
			}

			// Copie o guia de modo que os trabalhos diretos de desvinculação
			if (tipo de manipulador! == "string") {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $ .guid ++;
			}

			var match = event.match (/^([\w:-]*)\s*(.*)$/);
			var eventName = match [1] + instance.eventNamespace;
			var selector = match [2];

			if (selector) {
				delegateElement.on (eventName, selector, handlerProxy);
			} outro {
				element.on (eventName, handlerProxy);
			}
		});
	}

	_off: function (element, eventName) {
		eventName = (eventName || "") .split ("") .join (this.eventNamespace + "") +
			this.eventNamespace;
		element.off (eventName) .off (eventName);

		// Limpe a pilha para evitar vazamentos de memória (# 10056)
		this.bindings = $ (this.bindings.not (elemento) .get ());
		this.focusable = $ (this.focusable.not (element) .get ());
		this.hoverable = $ (this.hoverable.not (elemento) .get ());
	}

	_delay: function (handler, delay) {
		function handlerProxy () {
			return (manipulador de tipos === "string"? instance [handler]: manipulador)
				.apply (instância, argumentos);
		}
		var instance = this;
		return setTimeout (handlerProxy, atraso || 0);
	}

	_hoverable: function (element) {
		this.hoverable = this.hoverable.add (elemento);
		this._on (elemento, {
			mouseenter: function (event) {
				this._addClass ($ (event.currentTarget), null, "ui-state-hover");
			}
			mouseleave: function (event) {
				this._removeClass ($ (event.currentTarget), null, "ui-state-hover");
			}
		});
	}

	_focusable: function (element) {
		this.focusable = this.focusable.add (elemento);
		this._on (elemento, {
			focusin: function (event) {
				this._addClass ($ (event.currentTarget), null, "ui-state-focus");
			}
			focusout: function (event) {
				this._removeClass ($ (event.currentTarget), null, "ui-state-focus");
			}
		});
	}

	_trigger: function (type, event, data) {
		var prop, orig;
		var callback = this.options [tipo];

		dados = dados || {};
		event = $ .Event (evento);
		event.type = (type === this.widgetEventPrefix?
			tipo :
			this.widgetEventPrefix + tipo) .toLowerCase ();

		// O evento original pode vir de qualquer elemento
		// então precisamos redefinir o alvo no novo evento
		event.target = this.element [0];

		// Copie as propriedades do evento original para o novo evento
		orig = event.originalEvent;
		if (orig) {
			para (prop in orig) {
				if (! (prop in event)) {
					evento [prop] = orig [prop];
				}
			}
		}

		this.element.trigger (evento, dados);
		return! ($ .isFunction (callback) &&
			callback.apply (this.element [0], [event] .concat (data)) === falso ||
			event.isDefaultPrevented ());
	}
};

$ .each ({show: "fadeIn", ocultar: "fadeOut"}, function (método, defaultEffect) {
	$ .Widget.prototype ["_" + method] = function (elemento, opções, retorno de chamada) {
		if (opções typeof === "string") {
			opções = {efeito: opções};
		}

		var hasOptions;
		var effectName =! opções?
			método:
			opções === true || opções de typeof === "number"?
				defaultEffect:
				opções.efeito || defaultEffect;

		opções = opções || {};
		if (opções typeof === "number") {
			opções = {duração: opções};
		}

		hasOptions =! $. isEmptyObject (opções);
		options.complete = retorno de chamada;

		if (options.delay) {
			element.delay (options.delay);
		}

		if (hasOptions && $ .effects && $ .effects.effect [effectName]) {
			elemento [método] (opções);
		} else if (effectName! == método && elemento [effectName]) {
			elemento [effectName] (options.duration, options.easing, callback);
		} outro {
			element.queue (função (próximo) {
				$ (this) [método] ();
				if (callback) {
					callback.call (elemento [0]);
				}
				Próximo();
			});
		}
	};
});

var widget = $ .widget;


/ *!
 Posição da UI do jQuery 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 * /

// >> label: posição
// >> group: Core
// >> description: Posiciona os elementos em relação a outros elementos.
// >> docs: http://api.jqueryui.com/position/
// >> demos: http://jqueryui.com/position/


(function () {
var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	rhorizontal = / left | center | right /,
	vertical = / superior | centro | inferior /,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = / ^ \ w + /,
	rpercent = /% $ /,
	_position = $ .fn.position;

function getOffsets (offsets, largura, altura) {
	Retorna [
		parseFloat (offsets [0]) * (rpercent.test (offsets [0])? largura / 100: 1),
		parseFloat (offsets [1]) * (rpercent.test (offsets [1])? altura / 100: 1)
	];
}

função parseCss (element, property) {
	return parseInt ($ .css (elemento, propriedade), 10) || 0;
}

function getDimensions (elem) {
	var raw = elem [0];
	if (raw.nodeType === 9) {
		Retorna {
			largura: elem.width (),
			height: elem.height (),
			offset: {top: 0, esquerda: 0}
		};
	}
	if ($ .isWindow (raw)) {
		Retorna {
			largura: elem.width (),
			height: elem.height (),
			offset: {top: elem.scrollTop (), à esquerda: elem.scrollLeft ()}
		};
	}
	if (raw.preventDefault) {
		Retorna {
			largura: 0,
			altura: 0,
			offset: {top: raw.pageY, à esquerda: raw.pageX}
		};
	}
	Retorna {
		largura: elem.outerWidth (),
		height: elem.outerHeight (),
		Deslocamento: elem.offset ()
	};
}

$ .position = {
	scrollbarWidth: function () {
		if (cachedScrollbarWidth! == undefined) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $ ("<div" +
				"style = 'display: block; posição: absoluto; largura: 50px; altura: 50px; estouro: oculto;'>" +
				"<div style = 'height: 100px; largura: auto;'> </ div> </ div>"),
			innerDiv = div.children () [0];

		$ ("body") .append (div);
		w1 = innerDiv.offsetWidth;
		div.css ("estouro", "rolagem");

		w2 = innerDiv.offsetWidth;

		if (w1 === w2) {
			w2 = div [0] .clientWidth;
		}

		div.remove ();

		return (cachedScrollbarWidth = w1 - w2);
	}
	getScrollInfo: function (within) {
		var overflowX = within.isWindow || dentro do documento? "":
				dentro de .element.css ("overflow-x"),
			overflowY = dentro.isWindow || dentro do documento? "":
				within.element.css ("overflow-y"),
			hasOverflowX = overflowX === "rolar" ||
				(overflowX === "auto" && within.width <within.element [0] .scrollWidth),
			hasOverflowY = overflowY === "scroll" ||
				(overflowY === "auto" && within.height <dentro do elemento [0] .scrollHeight);
		Retorna {
			width: hasOverflowY? $ .position.scrollbarWidth (): 0,
			height: hasOverflowX? $ .position.scrollbarWidth (): 0
		};
	}
	getWithinInfo: function (element) {
		var withinElement = $ (elemento || janela),
			isWindow = $ .isWindow (withinElement [0]),
			isDocument = !! withinElement [0] && withinElement [0] .nodeType === 9,
			hasOffset =! isWindow &&! isDocument;
		Retorna {
			elemento: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			deslocamento: hasOffset? $ (elemento) .offset (): {left: 0, top: 0},
			scrollLeft: withinElement.scrollLeft (),
			scrollTop: withinElement.scrollTop (),
			width: withinElement.outerWidth (),
			height: withinElement.outerHeight ()
		};
	}
};

$ .fn.position = function (options) {
	if (! opções ||! options.of) {
		return _position.apply (isto, argumentos);
	}

	// Faça uma cópia, não queremos modificar argumentos
	opções = $ .extend ({}, opções);

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensões,
		target = $ (options.of),
		dentro de = $ .position.getWithinInfo (options.within),
		scrollInfo = $ .position.getScrollInfo (dentro),
		colisão = (options.collision || "flip") .split (""),
		deslocamentos = {};

	dimensions = getDimensions (target);
	if (target [0] .preventDefault) {

		// Força o topo esquerdo para permitir virar
		options.at = "superior esquerdo";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;

	// Clone para reutilizar o targetOffset original mais tarde
	basePosition = $ .extend ({}, targetOffset);

	// Força minha e em para ter posições horizontais e verticais válidas
	// se um valor estiver ausente ou inválido, ele será convertido no centro
	$ .each (["my", "at"], function () {
		var pos = (options [this] || "") .split (""),
			horizontalOffset,
			verticalOffset;

		if (pos.length === 1) {
			pos = rhorizontal.test (pos [0])?
				pos.concat (["center"]):
				rvertical.test (pos [0])?
					["center"] .concat (pos):
					["center", "center"];
		}
		pos [0] = rhorizontal.test (pos [0])? pos [0]: "center";
		pos [1] = rvertical.test (pos [1])? pos [1]: "center";

		// Calcular compensações
		horizontalOffset = roffset.exec (pos [0]);
		verticalOffset = roffset.exec (pos [1]);
		offsets [this] = [
			horizontalOffset? horizontalOffset [0]: 0,
			verticalOffset? verticalOffset [0]: 0
		];

		// Reduzir para apenas as posições sem os offsets
		opções [this] = [
			rposition.exec (pos [0]) [0],
			rposition.exec (pos [1]) [0]
		];
	});

	// Normalize a opção de colisão
	if (collision.length === 1) {
		colisão [1] = colisão [0];
	}

	if (options.at [0] === "direito") {
		basePosition.left + = targetWidth;
	} else if (options.at [0] === "center") {
		basePosition.left + = targetWidth / 2;
	}

	if (options.at [1] === "bottom") {
		basePosition.top + = targetHeight;
	} else if (options.at [1] === "center") {
		basePosition.top + = targetHeight / 2;
	}

	atOffset = getOffsets (offsets.at, targetWidth, targetHeight);
	basePosition.left + = atOffset [0];
	basePosition.top + = atOffset [1];

	return this.each (function () {
		var collisionPosition, usando,
			elem = $ (this),
			elemWidth = elem.outerWidth (),
			elemHeight = elem.outerHeight (),
			marginLeft = parseCss (this, "marginLeft"),
			marginTop = parseCss (this, "marginTop"),
			collisionWidth = elemWidth + marginLeft + parseCss (isso, "marginRight") +
				scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss (isso, "marginBottom") +
				scrollInfo.height,
			position = $ .extend ({}, basePosition),
			myOffset = getOffsets (offsets.my, elem.outerWidth (), elem.outerHeight ());

		if (options.my [0] === "right") {
			position.left - = elemWidth;
		} else if (options.my [0] === "center") {
			position.left - = elemWidth / 2;
		}

		if (options.my [1] === "bottom") {
			position.top - = elemHeight;
		} else if (options.my [1] === "center") {
			position.top - = elemHeight / 2;
		}

		position.left + = myOffset [0];
		position.top + = myOffset [1];

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$ .each (["left", "top"], função (i, dir) {
			if ($ .ui.position [colisão [i]]) {
				$ .ui.position [colisão [i]] [dir] (posição, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					colisãoAltura: colisãoAltura,
					deslocamento: [atOffset [0] + myOffset [0], atOffset [1] + myOffset [1]],
					meu: options.my,
					em: options.at,
					dentro de: dentro,
					elem: elem
				});
			}
		});

		if (options.using) {

			// Adiciona feedback como segundo argumento ao uso de retorno de chamada, se presente
			using = function (props) {
				var à esquerda = targetOffset.left - position.left,
					direita = esquerda + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						alvo: {
							elemento: alvo,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						}
						elemento: {
							elemento: elem,
							esquerda: position.left,
							top: position.top,
							largura: elemWidth,
							altura: elemHeight
						}
						horizontal: certo <0? "esquerda": esquerda> 0? "direita": "centro"
						vertical: fundo <0? "top": top> 0? "fundo": "meio"
					};
				if (targetWidth <elemWidth && abs (esquerda + direita) <targetWidth) {
					feedback.horizontal = "center";
				}
				if (targetHeight <elemHeight && abs (superior + inferior) <targetHeight) {
					feedback.vertical = "meio";
				}
				if (max (abs (esquerda), abs (direita))> max (abs (superior), abs (inferior))) {
					feedback.important = "horizontal";
				} outro {
					feedback.important = "vertical";
				}
				options.using.call (isso, adereços, feedback);
			};
		}

		elem.offset ($ .extend (position, {using: using})));
	});
};

$ .ui.position = {
	em forma: {
		esquerda: função (posição, dados) {
			var within = data.within,
				withinOffset = dentro.isWindow? within.scrollLeft: within.offset.left,
				outerWidth = dentro.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// O elemento é mais largo que dentro
			if (data.collisionWidth> outerWidth) {

				// O elemento está inicialmente no lado esquerdo de dentro
				if (overLeft> 0 && overRight <= 0) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
						withinOffset;
					position.left + = overLeft - newOverRight;

				// O elemento está inicialmente do lado direito de dentro
				} else if (overRight> 0 && overLeft <= 0) {
					position.left = withinOffset;

				// O elemento é inicialmente sobre os lados esquerdo e direito de dentro
				} outro {
					if (overLeft> overRight) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} outro {
						position.left = withinOffset;
					}
				}

			// Muito longe à esquerda -> alinhar com a borda esquerda
			} else if (overLeft> 0) {
				position.left + = overLeft;

			// Muito à direita -> alinhar com a borda direita
			} else if (overRight> 0) {
				position.left - = overRight;

			// Ajustar com base na posição e margem
			} outro {
				position.left = máx (position.left - collisionPosLeft, position.left);
			}
		}
		top: function (position, data) {
			var within = data.within,
				withinOffset = dentro.isWindow? dentro de.scrollTop: dentro de .offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// O elemento é mais alto que dentro
			if (data.collisionHeight> outerHeight) {

				// O elemento está inicialmente no topo de dentro
				if (overTop> 0 && overBottom <= 0) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
						withinOffset;
					position.top + = overTop - newOverBottom;

				// O elemento está inicialmente no fundo de dentro
				} else if (overBottom> 0 && overTop <= 0) {
					position.top = withinOffset;

				// O elemento é inicialmente sobre a parte superior e inferior de dentro
				} outro {
					if (overTop> overBottom) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} outro {
						position.top = withinOffset;
					}
				}

			// Muito longe -> alinhar com o topo
			} else if (overTop> 0) {
				position.top + = overTop;

			// Muito abaixo -> alinhar com a borda inferior
			} else if (overBottom> 0) {
				position.top - = overBottom;

			// Ajustar com base na posição e margem
			} outro {
				position.top = max (position.top - collisionPosTop, position.top);
			}
		}
	}
	giro: {
		esquerda: função (posição, dados) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = dentro.width,
				offsetLeft = dentro.isWindow? within.scrollLeft: within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my [0] === "esquerda"?
					-data.elemWidth:
					data.my [0] === "right"?
						data.elemWidth:
						0,
				atOffset = data.at [0] === "esquerda"?
					data.targetWidth:
					data.at [0] === "right"?
						-data.targetWidth:
						0,
				deslocamento = -2 * data.offset [0],
				newOverRight,
				newOverLeft;

			if (overLeft <0) {
				newOverRight = position.left + myOffset + atOffset + deslocamento + data.collisionWidth -
					outerWidth - withinOffset;
				if (newOverRight <0 || newOverRight <abs (overLeft)) {
					position.left + = myOffset + atOffset + deslocamento;
				}
			} else if (overRight> 0) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
					atOffset + offset - offsetLeft;
				if (newOverLeft> 0 || abs (newOverLeft) <overRight) {
					position.left + = myOffset + atOffset + deslocamento;
				}
			}
		}
		top: function (position, data) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = dentro.isWindow? dentro de.scrollTop: dentro de .offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my [1] === "top",
				myOffset = top?
					-data.elemHeight:
					data.my [1] === "bottom"?
						data.elemHeight:
						0,
				atOffset = data.at [1] === "top"?
					data.targetHeight:
					data.at [1] === "bottom"?
						-data.targetHeight:
						0,
				offset = -2 * data.offset [1],
				newOverTop,
				newOverBottom;
			if (overTop <0) {
				newOverBottom = position.top + myOffset + atOffset + deslocamento + data.collisionHeight -
					outerHeight - withinOffset;
				if (newOverBottom <0 || newOverBottom <abs (overTop)) {
					position.top + = myOffset + atOffset + deslocamento;
				}
			} else if (overBottom> 0) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
					offset - offsetTop;
				if (newOverTop> 0 || abs (newOverTop) <overBottom) {
					position.top + = myOffset + atOffset + deslocamento;
				}
			}
		}
	}
	flipfit: {
		left: function () {
			$ .ui.position.flip.left.apply (isto, argumentos);
			$ .ui.position.fit.left.apply (isto, argumentos);
		}
		top: function () {
			$ .ui.position.flip.top.apply (isto, argumentos);
			$ .ui.position.fit.top.apply (isto, argumentos);
		}
	}
};

}) ();

var position = $ .ui.position;


/ *!
 * IU do jQuery: dados 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label:: seletor de dados
// >> group: Core
// >> description: Seleciona elementos que possuem dados armazenados sob a chave especificada.
// >> docs: http://api.jqueryui.com/data-selector/


var data = $ .extend ($ .expr [":"], {
	dados: $ .expr.createPseudo?
		$ .expr.createPseudo (function (dataName) {
			função de retorno (elem) {
				return !! $. data (elem, dataName);
			};
		}):

		// Suporte: jQuery <1.8
		função (elem, i, match) {
			return !! $. data (elem, match [3]);
		}
});

/ *!
 * jQuery UI Desativar Seleção 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: disableSelection
// >> group: Core
// >> description: Desabilita a seleção do conteúdo de texto dentro do conjunto de elementos correspondentes.
// >> docs: http://api.jqueryui.com/disableSelection/

// Este arquivo está obsoleto


var disableSelection = $ .fn.extend ({
	disableSelection: (function () {
		var eventType = "onselectstart" em document.createElement ("div")?
			"selectstart":
			"mousedown";

		função de retorno () {
			return this.on (eventType + ".ui-disableSelection", função (evento) {
				event.preventDefault ();
			});
		};
	}) (),

	enableSelection: function () {
		return this.off (".ui-disableSelection");
	}
});


/ *!
 * jQuery UI Effects 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Effects Core
// >> group: efeitos
// jscs: disable maximumLineLength
// >> description: Estende os efeitos internos do jQuery. Inclui morphing e facilitando. Requerido por todos os outros efeitos.
// jscs: enable maximumLineLength
// >> docs: http://api.jqueryui.com/category/effects-core/
// >> demos: http://jqueryui.com/effect/



var dataSpace = "ui-effects-",
	dataSpaceStyle = "ui-effects-style",
	dataSpaceAnimated = "ui-efeitos animados",

	// Cria um jQuery local porque o jQuery Color confia nele e no
	// global pode não existir com a AMD e uma compilação personalizada (# 10199)
	jQuery = $;

$ .effects = {
	efeito: {}
};

/ *!
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2014 jQuery Foundation e outros colaboradores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 *
 * Data: quarta-feira 16 de janeiro 08:47:09 2013 -0600
 * /
(função (jQuery, undefined) {

	var stepHooks = "backgroundCor borderBottomColor borderLeftColor borderRightColor" +
		"borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

	// teste Plusequals para + = 100 - = 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,

	// Um ​​conjunto de REs que podem corresponder strings e gerar tuplas de cores.
	stringParsers = [{
			re: / rgba? \ (\ s * (\ d {1,3}) \ s *, \ s * (\ d {1,3}) \ s *, \ s * (\ d {1,3} ) \ s * (?:, \ s * (\ d? (?: \. \ d +)?) \ s *)? \) /,
			parse: function (execResult) {
				Retorna [
					execResult [1],
					execResult [2],
					execResult [3],
					execResult [4]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s* , \ s * (\ d + (?: \. \ d +)?) \% \ s * (?:, \ s * (\ d? (?: \. \ d +)?) \ s *)? \) /
			parse: function (execResult) {
				Retorna [
					execResult [1] * 2.55,
					execResult [2] * 2.55,
					execResult [3] * 2.55,
					execResult [4]
				];
			}
		}, {

			// Esta regex ignora AF porque é comparada com uma string já em minúsculas
			re: / # ([a-f0-9] {2}) ([a-f0-9] {2}) ([a-f0-9] {2}) /,
			parse: function (execResult) {
				Retorna [
					parseInt (execResult [1], 16),
					parseInt (execResult [2], 16),
					parseInt (execResult [3], 16)
				];
			}
		}, {

			// Esta regex ignora AF porque é comparada com uma string já em minúsculas
			re: / # ([a-f0-9]) ([a-f0-9]) ([a-f0-9]) /,
			parse: function (execResult) {
				Retorna [
					parseInt (execResult [1] + execResult [1], 16),
					parseInt (execResult [2] + execResult [2], 16),
					parseInt (execResult [3] + execResult [3], 16)
				];
			}
		}, {
			re: / hsla? \ (\ s * (\ d + (?: \. \ d +)?) \ s *, \ s * (\ d + (?: \. \ d +)?) \% \ s *, \ s * (\ d + (?: \. \ d +)?) \% \ s * (?:, \ s * (\ d? (?: \. \ d +)?) \ s *)? \) /,
			espaço: "hsla",
			parse: function (execResult) {
				Retorna [
					execResult [1],
					execResult [2] / 100,
					execResult [3] / 100,
					execResult [4]
				];
			}
		}],

	// JQuery.Color ()
	color = jQuery.Color = function (cor, verde, azul, alfa) {
		return new jQuery.Color.fn.parse (cor, verde, azul, alfa);
	}
	espaços = {
		rgba: {
			props: {
				vermelho: {
					idx: 0,
					tipo: "byte"
				}
				verde: {
					idx: 1,
					tipo: "byte"
				}
				blue: {
					idx: 2,
					tipo: "byte"
				}
			}
		}

		hsla: {
			props: {
				matiz: {
					idx: 0,
					tipo: "graus"
				}
				saturação: {
					idx: 1,
					tipo: "por cento"
				}
				leveza: {
					idx: 2,
					tipo: "por cento"
				}
			}
		}
	}
	propTypes = {
		"byte": {
			andar: verdadeiro
			max: 255
		}
		"percent": {
			max: 1
		}
		"graus": {
			mod: 360,
			andar: verdadeiro
		}
	}
	suporte = color.support = {},

	// Elemento para testes de suporte
	supportElem = jQuery ("<p>") [0],

	// Colors = jQuery.Color.names
	cores

	// Aliases locais de funções chamadas frequentemente
	each = jQuery.each;

// Determine o suporte do rgba imediatamente
supportElem.style.cssText = "background-color: rgba (1,1,1, 0,5)";
support.rgba = supportElem.style.backgroundColor.indexOf ("rgba")> -1;

// Definir o nome do cache e as propriedades alfa
// para espaços rgba e hsla
each (espaços, função (espaçoNome, espaço) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		tipo: "por cento",
		def: 1
	};
});

braçadeira de função (valor, prop, allowEmpty) {
	var type = propTypes [prop.type] || {};

	if (valor == nulo) {
		return (allowEmpty ||! prop.def)? null: prop.def;
	}

	// ~~ é um jeito curto de fazer andar para números positivos
	value = type.floor? ~~ valor: parseFloat (valor);

	// o IE passará em strings vazias como valor para alfa,
	// que atingirá este caso
	if (isNaN (valor)) {
		return prop.def;
	}

	if (type.mod) {

		// Adicionamos mod antes de modding para garantir que os valores negativos
		// é convertido corretamente: -10 -> 350
		return (valor + tipo.mod)% type.mod;
	}

	// Por enquanto todos os tipos de propriedade sem mod possuem min e max
	retornar 0> valor? 0: type.max <valor? type.max: value;
}

function stringParse (string) {
	var inst = color (),
		rgba = inst._rgba = [];

	string = string.toLowerCase ();

	each (stringParsers, função (i, parser) {
		var parsed,
			match = parser.re.exec (string),
			values ​​= match && parser.parse (correspondência),
			spaceName = parser.space || "rgba";

		if (valores) {
			parsed = inst [spaceName] (valores);

			// Se este for um rgba parse, a tarefa pode acontecer duas vezes
			// Ah bem....
			inst [espaços [espaçoNome] .cache] = parsed [espaços [espaçoNome] .cache];
			rgba = inst._rgba = parsed._rgba;

			// Saia de cada (stringParsers) porque combinamos
			retorna falso;
		}
	});

	// Encontrei um stringParser que lidou com isso
	if (rgba.length) {

		// Se isso veio de uma string analisada, force "transparent" quando alpha for 0
		// chrome, (e talvez outros) retornam "transparent" como rgba (0,0,0,0)
		if (rgba.join () === "0,0,0,0") {
			jQuery.extend (rgba, colors.transparent);
		}
		retorno inst;
	}

	// Cores nomeadas
	retornar cores [string];
}

color.fn = jQuery.extend (color.prototype, {
	parse: function (vermelho, verde, azul, alfa) {
		if (red === indefinido) {
			this._rgba = [nulo, nulo, nulo, nulo];
			devolva isto;
		}
		if (red.jquery || red.nodeType) {
			vermelho = jQuery (vermelho) .css (verde);
			verde = indefinido;
		}

		var inst = isso,
			type = jQuery.type (vermelho),
			rgba = this._rgba = [];

		// Mais de 1 argumento especificado - assume (vermelho, verde, azul, alfa)
		if (verde! == indefinido) {
			vermelho = [vermelho, verde, azul, alfa];
			type = "array";
		}

		if (tipo === "string") {
			return this.parse (stringParse (vermelho) || cores._default);
		}

		if (tipo === "array") {
			each (spaces.rgba.props, function (key, prop) {
				rgba [prop.idx] = grampo (vermelho [prop.idx], prop);
			});
			devolva isto;
		}

		if (tipo === "objeto") {
			if (red instanceof color) {
				each (espaços, função (espaçoNome, espaço) {
					if (vermelho [space.cache]) {
						inst [space.cache] = vermelho [space.cache] .slice ();
					}
				});
			} outro {
				each (espaços, função (espaçoNome, espaço) {
					var cache = space.cache;
					each (space.props, função (chave, prop) {

						// Se o cache não existir e soubermos convertê-lo
						if (! inst [cache] && space.to) {

							// Se o valor for nulo, não precisamos copiá-lo
							// se a chave for alpha, não precisamos copiar também
							if (chave === "alfa" || vermelho [chave] == nulo) {
								Retorna;
							}
							inst [cache] = space.to (inst._rgba);
						}

						// Esse é o único caso em que permitimos valores nulos para todas as propriedades.
						// chama o clamp com alwaysAllowEmpty
						inst [cache] [prop.idx] = pinça (vermelho [chave], prop, verdadeiro);
					});

					// Tudo definido, mas alfa?
					if (inst [cache] &&
							jQuery.inArray (null, inst [cache] .slice (0, 3)) <0) {

						// Use o padrão de 1
						inst [cache] [3] = 1;
						if (space.from) {
							inst._rgba = space.from (inst [cache]);
						}
					}
				});
			}
			devolva isto;
		}
	}
	é: função (comparar) {
		var é = cor (compare),
			same = true,
			inst = isto;

		each (espaços, função (_, espaço) {
			var localCache,
				isCache = é [space.cache];
			if (isCache) {
				localCache = inst [space.cache] || space.to && space.to (inst._rgba) || [];
				each (space.props, function (_, prop) {
					if (isCache [prop.idx]! = nulo) {
						same = (isCache [prop.idx] === localCache [prop.idx]);
						retorne mesmo;
					}
				});
			}
			retorne mesmo;
		});
		retorne mesmo;
	}
	_space: function () {
		var used = [],
			inst = isto;
		each (espaços, função (espaçoNome, espaço) {
			if (inst [space.cache]) {
				used.push (spaceName);
			}
		});
		return used.pop ();
	}
	transição: função (outro, distância) {
		var end = cor (outro),
			spaceName = end._space (),
			espaço = espaços [nomeEspaço],
			startColor = this.alpha () === 0? cor ("transparente"): isso,
			start = startColor [space.cache] || space.to (startColor._rgba),
			resultado = start.slice ();

		end = end [space.cache];
		each (space.props, função (chave, prop) {
			var index = prop.idx,
				startValue = start [index],
				endValue = end [index],
				type = propTypes [prop.type] || {};

			// Se nulo, não substitua o valor inicial
			if (endValue === null) {
				Retorna;
			}

			// If null - use end
			if (startValue === null) {
				resultado [index] = endValue;
			} outro {
				if (type.mod) {
					if (endValue - startValue> type.mod / 2) {
						startValue + = type.mod;
					} else if (startValue - endValue> type.mod / 2) {
						startValue - = type.mod;
					}
				}
				resultado [index] = clamp ((endValue - startValue) * distância + startValue, prop);
			}
		});
		return this [spaceName] (resultado);
	}
	blend: function (opaco) {

		// Se já somos opacos - devolva-se
		if (this._rgba [3] === 1) {
			devolva isto;
		}

		var rgb = this._rgba.slice (),
			a = rgb.pop (),
			mistura = cor (opaco) ._ rgba;

		retornar cor (jQuery.map (rgb, function (v, i) {
			return (1 - a) * mistura [i] + a * v;
		}));
	}
	toRgbaString: function () {
		var prefix = "rgba (",
			rgba = jQuery.map (this._rgba, function (v, i) {
				return v == null? (i> 2? 1: 0): v;
			});

		if (rgba [3] === 1) {
			rgba.pop ();
			prefixo = "rgb (";
		}

		return prefixo + rgba.join () + ")";
	}
	toHslaString: function () {
		var prefix = "hsla (",
			hsla = jQuery.map (this.hsla (), função (v, i) {
				if (v == null) {
					v = i> 2? 1: 0;
				}

				// Captura 1 e 2
				if (i && i <3) {
					v = Math.round (v * 100) + "%";
				}
				return v;
			});

		if (hsla [3] === 1) {
			hsla.pop ();
			prefixo = "hsl (";
		}
		return prefixo + hsla.join () + ")";
	}
	toHexString: function (includeAlpha) {
		var rgba = this._rgba.slice (),
			alfa = rgba.pop ();

		if (includeAlpha) {
			rgba.push (~ ~ (alfa * 255));
		}

		return "#" + jQuery.map (rgba, function (v) {

			// Padrão para 0 quando existem nulos
			v = (v || 0) .toString (16);
			return v.length === 1? "0" + v: v;
		} ).Junte-se( "" );
	}
	toString: function () {
		devolve this._rgba [3] === 0? "transparente": this.toRgbaString ();
	}
});
color.fn.parse.prototype = color.fn;

// Conversões de Hsla adaptadas de:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

função hue2rgb (p, q, h) {
	h = (h + 1)% 1;
	if (h * 6 <1) {
		return p + (q - p) * h * 6;
	}
	if (h * 2 <1) {
		retorno q;
	}
	if (h * 3 <2) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function (rgba) {
	if (rgba [0] == null || rgba [1] == null || rgba [2] == nulo) {
		return [nulo, nulo, nulo, rgba [3]];
	}
	var r = rgba [0] / 255,
		g = rgba [1] / 255,
		b = rgba [2] / 255,
		a = rgba [3],
		max = Math.max (r, g, b),
		min = Math.min (r, g, b),
		diff = max - min,
		add = max + min,
		l = adicionar * 0,5,
		h, s;

	if (min === max) {
		h = 0;
	} else if (r === max) {
		h = (60 * (g - b) / diff) + 360;
	} else if (g === max) {
		h = (60 * (b - r) / diff) + 120;
	} outro {
		h = (60 * (r - g) / diff) + 240;
	}

	// Croma (diff) == 0 significa escala de cinzentos que, por definição, saturação = 0%
	// caso contrário, a saturação é baseada na proporção de chroma (diff) para lightness (add)
	if (diff === 0) {
		s = 0;
	} else if (l <= 0,5) {
		s = diff / add;
	} outro {
		s = diff / (2 - adicionar);
	}
	return [Math.round (h)% 360, s, l, a = nulo? 1: a];
};

spaces.hsla.from = function (hsla) {
	if (hsla [0] == null || hsla [1] == null || hsla [2] == nulo) {
		return [null, null, null, hsla [3]];
	}
	var h = hsla [0] / 360,
		s = hsla [1],
		l = hsla [2],
		a = hsla [3],
		q = l <= 0,5? l * (1 + s): l + s - l * s,
		p = 2 * l - q;

	Retorna [
		Math.round (hue2rgb (p, q, h + (1/3)) * 255),
		Math.round (hue2rgb (p, q, h) * 255),
		Math.round (hue2rgb (p, q, h - (1/3)) * 255),
		uma
	];
};

each (espaços, função (espaçoNome, espaço) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// Faz rgba () e hsla ()
	color.fn [spaceName] = function (value) {

		// Gere um cache para este espaço se ele não existir
		if (para &&! this [cache]) {
			isso [cache] = para (this._rgba);
		}
		if (value === undefined) {
			retorne este [cache] .slice ();
		}

		var ret,
			tipo = jQuery.type (valor),
			arr = (type === "array" || type === "objeto")? valor: argumentos,
			local = this [cache] .slice ();

		each (props, function (key, prop) {
			var val = arr [type === "objeto"? chave: prop.idx];
			if (val == null) {
				val = local [prop.idx];
			}
			local [prop.idx] = braçadeira (val, prop);
		});

		if (from) {
			ret = color (de (local));
			ret [cache] = local;
			retorno ret;
		} outro {
			cor de retorno (local);
		}
	};

	// Torna vermelho () verde () azul () alfa () matiz () saturação () leveza ()
	each (props, function (key, prop) {

		// Alpha está incluído em mais de um espaço
		if (color.fn [chave]) {
			Retorna;
		}
		color.fn [key] = function (value) {
			var vtype = jQuery.type (value),
				fn = (key === "alpha"? (this._hsla? "hsla": "rgba"): nomeEspaço),
				local = this [fn] (),
				cur = local [prop.idx],
				Combine;

			if (vtype === "indefinido") {
				return cur;
			}

			if (vtype === "function") {
				value = value.call (isso, cur);
				vtype = jQuery.type (valor);
			}
			if (valor == null && prop.empty) {
				devolva isto;
			}
			if (vtype === "string") {
				match = rplusequals.exec (valor);
				if (match) {
					valor = cur + parseFloat (correspondência [2]) * (correspondência [1] === "+"? 1: -1);
				}
			}
			local [prop.idx] = valor;
			return this [fn] (local);
		};
	});
});

// Adiciona a função cssHook e .fx.step para cada gancho nomeado.
// aceita uma string de propriedades separadas por espaços
color.hook = function (hook) {
	var hooks = hook.split ("");
	each (ganchos, função (i, gancho) {
		jQuery.cssHooks [hook] = {
			set: function (elem, value) {
				var parsed, curElem,
					backgroundColor = "";

				if (valor! == "transparente" && (jQuery.type (valor)! == "string" ||
						(parsed = stringParse (value)))) {
					valor = cor (valor analisado ||);
					if (! support.rgba && value._rgba [3]! == 1) {
						curElem = hook === "backgroundColor"? elem.parentNode: elem;
						enquanto (
							(backgroundColor === "" || backgroundColor === "transparent") &&
							curElem && curElem.style
						) {
							experimentar {
								backgroundColor = jQuery.css (curElem, "backgroundColor");
								curElem = curElem.parentNode;
							} pegar (e) {
							}
						}

						value = value.blend (backgroundColor && backgroundColor! == "transparente"?
							cor de fundo :
							"_padrão" );
					}

					value = value.toRgbaString ();
				}
				experimentar {
					elem.style [hook] = valor;
				} pegar (e) {

					// Envolto para evitar que o IE envie erros em valores "inválidos", como
					// 'auto' ou 'herdar'
				}
			}
		};
		jQuery.fx.step [hook] = function (fx) {
			if (! fx.colorInit) {
				fx.start = cor (fx.elem, gancho);
				fx.end = color (fx.end);
				fx.colorInit = true;
			}
			jQuery.cssHooks [hook] .set (fx.elem, fx.start.transition (fx.end, fx.pos));
		};
	});

};

color.hook (stepHooks);

jQuery.cssHooks.borderColor = {
	expand: function (value) {
		var expandido = {};

		each (["Top", "Right", "Bottom", "Left"], função (i, parte) {
			expandido ["border" + part + "Color"] = valor;
		});
		retorno expandido;
	}
};

// Somente nomes de cores básicas.
// O uso de qualquer outro nome de cor requer a inclusão de você mesmo ou incluindo
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {

	// 4.1. Palavras-chave básicas em cores
	aqua: "# 00ffff",
	preto: "# 000000",
	azul: "# 0000ff",
	fúcsia: "# ff00ff",
	cinza: "# 808080",
	verde: "# 008000",
	cal: "# 00ff00",
	marrom: "# 800000",
	navy: "# 000080",
	azeitona: "# 808000",
	roxo: "# 800080",
	vermelho: "# ff0000",
	prata: "# c0c0c0",
	cerceta: "# 008080",
	branco: "#ffffff",
	amarelo: "# ffff00",

	// 4.2.3. palavra-chave de cor "transparente"
	transparent: [null, null, null, 0],

	_default: "#ffffff"
};

}) (jQuery);

/ ************************************************* ***************************** /
/ ****************************** ANIMAÇÕES DE CLASSE ***************** ************* /
/ ************************************************* ***************************** /
(function () {

var classAnimationActions = ["adicionar", "remover", "alternar"],
	shorthandStyles = {
		fronteira: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		Limite de largura: 1,
		margem: 1,
		preenchimento: 1
	};

$ .each (
	["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"],
	function (_, prop) {
		$ .fx.step [prop] = function (fx) {
			if (fx.end! == "none" &&! fx.setAttr || fx.pos === 1 &&! fx.setAttr) {
				jQuery.style (fx.elem, prop, fx.end);
				fx.setAttr = true;
			}
		};
	}
);

function getElementStyles (elem) {
	chave de var, len,
		style = elem.ownerDocument.defaultView?
			elem.ownerDocument.defaultView.getComputedStyle (elem, null):
			elem.currentStyle,
		styles = {};

	if (estilo && estilo.length && estilo [0] && estilo [estilo [0]]) {
		len = style.length;
		while (len--) {
			key = style [len];
			if (tipo de estilo [chave] === "string") {
				estilos [$ .camelCase (key)] = estilo [chave];
			}
		}

	// Suporte: Opera, IE <9
	} outro {
		for (key in style) {
			if (tipo de estilo [chave] === "string") {
				estilos [chave] = estilo [chave];
			}
		}
	}

	retornar estilos;
}

function styleDifference (oldStyle, newStyle) {
	var diff = {},
		nome, valor;

	para (nome em newStyle) {
		value = newStyle [nome];
		if (oldStyle [name]! == valor) {
			if (! shorthandStyles [nome]) {
				if ($ .fx.step [nome] ||! isNaN (parseFloat (valor))) {
					diff [nome] = valor;
				}
			}
		}
	}

	return diff;
}

// Suporte: jQuery <1.8
if (! $. fn.addBack) {
	$ .fn.addBack = function (selector) {
		return this.add (selector == null?
			this.prevObject: this.prevObject.filter (seletor)
		);
	};
}

$ .effects.animateClass = function (valor, duração, atenuação, retorno de chamada) {
	var o = $ .speed (duração, atenuação, retorno de chamada);

	return this.queue (function () {
		var animated = $ (this),
			baseClass = animated.attr ("class") || "",
			applyClassChange,
			allAnimations = o.children? animated.find ("*") .addBack (): animado;

		// Mapeie os objetos animados para armazenar os estilos originais.
		allAnimations = allAnimations.map (function () {
			var el = $ (this);
			Retorna {
				el: el,
				start: getElementStyles (isso)
			};
		});

		// Aplicar mudança de turma
		applyClassChange = function () {
			$ .each (classAnimationActions, função (i, ação) {
				if (valor [ação]) {
					animação [ação + "Classe"] (valor [ação]);
				}
			});
		};
		applyClassChange ();

		// Mapeie todos os objetos animados novamente - calcule novos estilos e diferencie
		allAnimations = allAnimations.map (function () {
			this.end = getElementStyles (this.el [0]);
			this.diff = styleDifference (this.start, this.end);
			devolva isto;
		});

		// Aplicar classe original
		animated.attr ("class", baseClass);

		// Mapeie todos os objetos animados novamente - desta vez coletando uma promessa
		allAnimations = allAnimations.map (function () {
			var styleInfo = isso,
				dfd = $ .Deferred (),
				opts = $ .extend ({}, o, {
					fila: falso
					complete: function () {
						dfd.resolve (styleInfo);
					}
				});

			this.el.animate (this.diff, opts);
			return dfd.promise ();
		});

		// Depois que todas as animações forem concluídas:
		$ .when.apply ($, allAnimations.get ()) .done (function () {

			// Definir a classe final
			applyClassChange ();

			// Para cada elemento animado,
			// limpe todas as propriedades css que foram animadas
			$ .each (argumentos, função () {
				var el = this.el;
				$ .each (this.diff, function (key) {
					el.css (chave, "");
				});
			});

			// Isto é garantido para estar lá se você usar jQuery.speed ()
			// também lida com a remoção do próximo anim ...
			o.complete.call (animado [0]);
		});
	});
};

$ .fn.extend ({
	addClass: (function (orig) {
		Função de retorno (classNames, speed, easing, callback) {
			velocidade de retorno?
				$ .effects.animateClass.call (isso,
					{add: classNames}, velocidade, atenuação, retorno de chamada):
				orig.apply (isto, argumentos);
		};
	}) ($ .fn.addClass),

	removeClass: (function (orig) {
		Função de retorno (classNames, speed, easing, callback) {
			return arguments.length> 1?
				$ .effects.animateClass.call (isso,
					{remove: classNames}, velocidade, atenuação, retorno de chamada):
				orig.apply (isto, argumentos);
		};
	}) ($ .fn.removeClass),

	toggleClass: (function (orig) {
		função de retorno (classNames, force, speed, easing, callback) {
			if (typeof force === "booleano" || force === undefined) {
				if (! velocidade) {

					// Sem parâmetro de velocidade
					return orig.apply (isto, argumentos);
				} outro {
					return $ .effects.animateClass.call (isso,
						(forçar? {adicionar: classNames}: {remove: classNames}),
						velocidade, facilitação, retorno de chamada);
				}
			} outro {

				// Sem parâmetro de força
				return $ .effects.animateClass.call (isso,
					{toggle: classNames}, força, velocidade, facilitação);
			}
		};
	}) ($ .fn.toggleClass),

	switchClass: function (remove, add, speed, easing, callback) {
		return $ .effects.animateClass.call (isto, {
			adicionar: adicionar,
			remover: remover
		}, velocidade, facilitação, retorno de chamada);
	}
});

}) ();

/ ************************************************* ***************************** /
/ *********************************** EFEITOS ************* ********************* /
/ ************************************************* ***************************** /

(function () {

if ($ .expr && $ .expr.filters && $ .expr.filters.animated) {
	$ .expr.filters.animated = (function (orig) {
		função de retorno (elem) {
			return !! $ (elem) .data (dataSpaceAnimated) || orig (elem);
		};
	}) ($ .expr.filters.animated);
}

if ($ .uiBackCompat! == false) {
	$ .extend ($ .effects, {

		// Salva um conjunto de propriedades em um armazenamento de dados
		save: function (elemento, conjunto) {
			var i = 0, length = set.length;
			para (; i <comprimento; i ++) {
				if (set [i]! == null) {
					element.data (dataSpace + set [i], elemento [0] .style [set [i]]);
				}
			}
		}

		// Restaura um conjunto de propriedades salvas anteriormente de um armazenamento de dados
		restore: function (elemento, conjunto) {
			var val, i = 0, length = set.length;
			para (; i <comprimento; i ++) {
				if (set [i]! == null) {
					val = element.data (dataSpace + set [i]);
					element.css (conjunto [i], val);
				}
			}
		}

		setMode: function (el, mode) {
			if (mode === "toggle") {
				mode = el.is (": hidden")? "aparecer esconder";
			}
			modo de retorno;
		}

		// Envolve o elemento em torno de um wrapper que copia as propriedades de posição
		createWrapper: function (element) {

			// Se o elemento já estiver empacotado, devolva-o
			if (element.parent (). é (". -i-efeitos-wrapper")) {
				return element.parent ();
			}

			// Enrole o elemento
			var props = {
					width: element.outerWidth (true),
					height: element.outerHeight (true),
					"float": element.css ("float")
				}
				wrapper = $ ("<div> </ div>")
					.addClass ("ui-effects-wrapper")
					.css ({
						fontSize: "100%",
						fundo: "transparente",
						borda: "nenhum",
						margem: 0,
						preenchimento: 0
					}),

				// Armazena o tamanho caso a largura / altura estejam definidas em% - Correções # 5245
				size = {
					width: element.width (),
					height: element.height ()
				}
				active = document.activeElement;

			// Suporte: Firefox
			// O Firefox expõe incorretamente conteúdo anônimo
			// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
			experimentar {
				active.id;
			} pegar (e) {
				active = document.body;
			}

			element.wrap (wrapper);

			// Correções # 7595 - Os elementos perdem o foco quando estão envolvidos.
			if (elemento [0] === ativo || $ .contains (elemento [0], ativo)) {
				$ (ativo) .trigger ("focus");
			}

			// Hotfix para o jQuery 1.4, já que algumas mudanças no wrap () parecem realmente
			// perde a referência ao elemento envolvido
			wrapper = element.parent ();

			// Transferir propriedades de posicionamento para o wrapper
			if (element.css ("position") === "static") {
				wrapper.css ({position: "relative"});
				element.css ({position: "relative"});
			} outro {
				$ .extend (props, {
					position: element.css ("posição"),
					zIndex: element.css ("z-index")
				});
				$ .each (["top", "left", "bottom", "right"], função (i, pos) {
					props [pos] = element.css (pos);
					if (isNaN (parseInt (props [pos], 10))) {
						props [pos] = "auto";
					}
				});
				element.css ({
					posição: "relativo",
					top: 0,
					esquerda: 0,
					direita: "auto",
					fundo: "auto"
				});
			}
			element.css (tamanho);

			return wrapper.css (props) .show ();
		}

		removeWrapper: function (element) {
			var active = document.activeElement;

			if (element.parent (). é (". -i-efeitos-wrapper")) {
				element.parent (). replaceWith (elemento);

				// Correções # 7595 - Os elementos perdem o foco quando estão envolvidos.
				if (elemento [0] === ativo || $ .contains (elemento [0], ativo)) {
					$ (ativo) .trigger ("focus");
				}
			}

			elemento de retorno;
		}
	});
}

$ .extend ($ .effects, {
	versão: "1.12.1",

	define: function (nome, modo, efeito) {
		if (! efeito) {
			efeito = modo;
			mode = "effect";
		}

		$ .effects.effect [nome] = efeito;
		$ .effects.effect [name] .mode = mode;

		efeito de retorno;
	}

	scaledDimensions: function (element, percent, direction) {
		if (por cento === 0) {
			Retorna {
				altura: 0,
				largura: 0,
				outerHeight: 0,
				outerWidth: 0
			};
		}

		var x = direção! == "horizontal"? ((por cento || 100) / 100): 1,
			y = direção! == "vertical"? ((por cento || 100) / 100): 1;

		Retorna {
			height: element.height () * y,
			largura: element.width () * x,
			outerHeight: element.outerHeight () * y,
			outerWidth: element.outerWidth () * x
		};

	}

	clipToBox: function (animation) {
		Retorna {
			width: animation.clip.right - animation.clip.left,
			height: animation.clip.bottom - animation.clip.top,
			left: animation.clip.left,
			top: animation.clip.top
		};
	}

	// Injeta funções recentemente enfileiradas para serem as primeiras da fila (após "inprogress")
	unshift: function (element, queueLength, count) {
		var queue = element.queue ();

		if (queueLength> 1) {
			queue.splice.apply (fila,
				[1, 0] .concat (queue.splice (queueLength, contagem)));
		}
		element.dequeue ();
	}

	saveStyle: function (element) {
		element.data (dataSpaceStyle, elemento [0] .style.cssText);
	}

	restoreStyle: function (element) {
		elemento [0] .style.cssText = element.data (dataSpaceStyle) || "";
		element.removeData (dataSpaceStyle);
	}

	modo: função (elemento, modo) {
		var hidden = element.is (": hidden");

		if (mode === "toggle") {
			mode = hidden? "aparecer esconder";
		}
		if (oculto? modo === "esconder": modo === "show") {
			mode = "none";
		}
		modo de retorno;
	}

	// Traduz uma matriz [top, left] em um valor de linha de base
	getBaseline: function (origin, original) {
		var y, x;

		switch (origem [0]) {
		caso "top":
			y = 0;
			quebrar;
		caso "meio":
			y = 0,5;
			quebrar;
		caso "bottom":
			y = 1;
			quebrar;
		padrão:
			y = origem [0] / original.height;
		}

		switch (origem [1]) {
		caso "esquerda":
			x = 0;
			quebrar;
		caso "centro":
			x = 0,5;
			quebrar;
		caso "certo":
			x = 1;
			quebrar;
		padrão:
			x = origem [1] / original.width;
		}

		Retorna {
			x: x,
			y: y
		};
	}

	// Cria um elemento de espaço reservado para que o elemento original possa ser feito absoluto
	createPlaceholder: function (element) {
		var placeholder,
			cssPosition = element.css ("position"),
			position = element.position ();

		// Bloqueie as margens primeiro para considerar os elementos do formulário, que
		// mudará de margem se você definir explicitamente a altura
		// veja: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// Suporte: Safari
		element.css ({
			marginTop: element.css ("marginTop"),
			marginBottom: element.css ("marginBottom"),
			marginLeft: element.css ("marginLeft"),
			marginRight: element.css ("marginRight")
		})
		.outerWidth (element.outerWidth ())
		.outerHeight (element.outerHeight ());

		if (/ ^ (static | relative) /. test (cssPosition)) {
			cssPosition = "absolute";

			espaço reservado = $ ("<" + elemento [0] .nodeName + ">") .insertAfter (element) .css ({

				// Converter inline para bloqueio inline para considerar elementos inline
				// que liga para o bloco inline baseado no conteúdo (como img)
				display: / ^ (inline | ruby) /. teste (element.css ("display"))?
					"inline-block":
					"quadra",
				visibilidade: "oculto",

				// As margens precisam ser configuradas para levar em conta o colapso da margem
				marginTop: element.css ("marginTop"),
				marginBottom: element.css ("marginBottom"),
				marginLeft: element.css ("marginLeft"),
				marginRight: element.css ("marginRight"),
				"float": element.css ("float")
			})
			.outerWidth (element.outerWidth ())
			.outerHeight (element.outerHeight ())
			.addClass ("ui-effects-placeholder");

			element.data (dataSpace + "placeholder", placeholder);
		}

		element.css ({
			position: cssPosition,
			esquerda: position.left,
			top: position.top
		});

		return placeholder;
	}

	removePlaceholder: function (element) {
		var dataKey = dataSpace + "placeholder",
				espaço reservado = element.data (dataKey);

		if (marcador de posição) {
			placeholder.remove ();
			element.removeData (dataKey);
		}
	}

	// Remove um marcador de posição, se existir e restaura
	// propriedades que foram modificadas durante a criação do espaço reservado
	cleanUp: function (element) {
		$ .effects.restoreStyle (elemento);
		$ .effects.removePlaceholder (element);
	}

	setTransition: function (elemento, lista, fator, valor) {
		valor = valor || {};
		$ .each (lista, função (i, x) {
			var unit = element.cssUnit (x);
			if (unit [0]> 0) {
				valor [x] = unidade [0] * fator + unidade [1];
			}
		});
		valor de retorno;
	}
});

// Retorna um objeto de opções de efeito para os parâmetros fornecidos:
function _normalizeArguments (efeito, opções, velocidade, callback) {

	// Permitir passar todas as opções como o primeiro parâmetro
	if ($ .isPlainObject (effect)) {
		opções = efeito;
		efeito = effect.effect;
	}

	// Converter em um objeto
	efeito = {efeito: efeito};

	// Catch (efeito, null, ...)
	if (options == null) {
		opções = {};
	}

	// Catch (efeito, retorno de chamada)
	if ($ .isFunction (opções)) {
		retorno de chamada = opções;
		velocidade = nulo;
		opções = {};
	}

	// Catch (efeito, velocidade,?)
	if (opções typeof === "number" || $ .fx.speeds [opções]) {
		retorno de chamada = velocidade;
		velocidade = opções;
		opções = {};
	}

	// Catch (efeito, opções, retorno de chamada)
	if ($ .isFunction (velocidade)) {
		retorno de chamada = velocidade;
		velocidade = nulo;
	}

	// Adicione opções para efetuar
	if (opções) {
		$ .extend (efeito, opções);
	}

	velocidade = velocidade || opções.duração;
	effect.duration = $ .fx.off? 0:
		velocidade de digitação === "número"? Rapidez :
		velocidade em $ .fx.speeds? $ .fx.speeds [velocidade]:
		$ .fx.speeds._default;

	effect.complete = retorno de chamada || options.complete;

	efeito de retorno;
}

function standardAnimationOption (option) {

	// Velocidades padrão válidas (nada, número, velocidade nomeada)
	if (! option || typeof option === "número" || $ .fx.speeds [opção]) {
		retorno verdadeiro;
	}

	// Cadeias inválidas - trate como velocidade "normal"
	if (tipo de opção === "string" &&! $. effects.effect [opção]) {
		retorno verdadeiro;
	}

	// Chamada de retorno completa
	if ($ .isFunction (opção)) {
		retorno verdadeiro;
	}

	// Options hash (mas não nomeando um efeito)
	if (tipo de opção === "objeto" &&! option.effect) {
		retorno verdadeiro;
	}

	// Não correspondeu a nenhuma API padrão
	retorna falso;
}

$ .fn.extend ({
	efeito: função (/ * efeito, opções, velocidade, retorno de chamada * /) {
		var args = _normalizeArguments.apply (isto, argumentos),
			effectMethod = $ .effects.effect [args.effect],
			defaultMode = effectMethod.mode,
			queue = args.queue,
			queueName = fila || "fx",
			complete = args.complete,
			mode = args.mode,
			modos = [],
			prefilter = function (next) {
				var el = $ (this),
					normalizedMode = $ .effects.mode (el, mode) || modo padrão;

				// Sentinela para bater com o pato: seletor de psuedo animado
				el.data (dataSpaceAnimated, true);

				// Salve o modo de efeito para uso posterior,
				// não podemos simplesmente chamar $ .effects.mode novamente mais tarde,
				// como o .show () abaixo destrói o estado inicial
				modes.push (normalizedMode);

				// Veja $ .uiBackCompat dentro de run () para remoção de defaultMode em 1.13
				if (defaultMode && (normalizedMode === "show" ||
						(normalizedMode === defaultMode && normalizedMode === "ocultar"))) {
					el.show ();
				}

				if (! defaultMode || normalizedMode! == "nenhum") {
					$ .effects.saveStyle (el);
				}

				if ($ .isFunction (next)) {
					Próximo();
				}
			};

		if ($ .fx.off ||! effectMethod) {

			// Delegar ao método original (por exemplo, .show ()) se possível
			if (modo) {
				retorne este [mode] (args.duration, complete);
			} outro {
				return this.each (function () {
					se (completo) {
						complete.call (isso);
					}
				});
			}
		}

		função run (next) {
			var elem = $ (this);

			limpeza de função () {
				elem.removeData (dataSpaceAnimated);

				$ .effects.cleanUp (elem);

				if (args.mode === "ocultar") {
					elem.hide ();
				}

				feito();
			}

			função done () {
				if ($ .isFunction (complete)) {
					complete.call (elem [0]);
				}

				if ($ .isFunction (next)) {
					Próximo();
				}
			}

			// Substituir a opção de modo por elemento,
			// como alternar pode ser mostrar ou ocultar dependendo do estado do elemento
			args.mode = modes.shift ();

			if ($ .uiBackCompat! == false &&! defaultMode) {
				if (elem.is (": hidden")? mode === "esconder": modo === "show") {

					// Chame o método core para rastrear "olddisplay" apropriadamente
					elem [mode] ();
					feito();
				} outro {
					effectMethod.call (elem [0], args, done);
				}
			} outro {
				if (args.mode === "none") {

					// Chame o método core para rastrear "olddisplay" apropriadamente
					elem [mode] ();
					feito();
				} outro {
					effectMethod.call (elem [0], args, limpeza);
				}
			}
		}

		// Executa o pré-filtro em todos os elementos primeiro para garantir que
		// qualquer exibição ou ocultação acontece antes da criação do marcador de posição
		// que garante que qualquer alteração de layout seja capturada corretamente.
		fila de retorno === false?
			this.each (prefilter) .each (run):
			this.queue (queueName, prefilter) .queue (nome da fila, executar);
	}

	show: (função (orig) {
		função de retorno (opção) {
			if (standardAnimationOption (option)) {
				return orig.apply (isto, argumentos);
			} outro {
				var args = _normalizeArguments.apply (isto, argumentos);
				args.mode = "show";
				return this.effect.call (isto, args);
			}
		};
	}) ($. fn.show),

	hide: (função (orig) {
		função de retorno (opção) {
			if (standardAnimationOption (option)) {
				return orig.apply (isto, argumentos);
			} outro {
				var args = _normalizeArguments.apply (isto, argumentos);
				args.mode = "hide";
				return this.effect.call (isto, args);
			}
		};
	}) ($ .fn.hide),

	toggle: (função (orig) {
		função de retorno (opção) {
			if (standardAnimationOption (opção) || typeof option === "booleano") {
				return orig.apply (isto, argumentos);
			} outro {
				var args = _normalizeArguments.apply (isto, argumentos);
				args.mode = "toggle";
				return this.effect.call (isto, args);
			}
		};
	}) ($ .fn.toggle),

	cssUnit: function (key) {
		var style = this.css (chave),
			val = [];

		$ .each (["em", "px", "%", "pt"], função (i, unit) {
			if (style.indexOf (unit)> 0) {
				val = [parseFloat (style), unit];
			}
		});
		return val;
	}

	cssClip: function (clipObj) {
		if (clipObj) {
			retornar this.css ("clip", "rect (" + clipObj.top + "px" + clipObj.right + "px" +
				clipObj.bottom + "px" + clipObj.left + "px)");
		}
		return parseClip (this.css ("clip"), isto);
	}

	transferência: função (opções, feito) {
		var element = $ (this),
			target = $ (options.to),
			targetFixed = target.css ("position") === "fixed",
			body = $ ("body"),
			fixTop = targetFixed? body.scrollTop (): 0,
			fixLeft = targetFixed? body.scrollLeft (): 0,
			endPosition = target.offset (),
			animação = {
				top: endPosition.top - fixTop,
				left: endPosition.left - fixLeft,
				height: target.innerHeight (),
				largura: target.innerWidth ()
			}
			startPosition = element.offset (),
			transferência = $ ("<div class = 'ui-efeitos-transferência'> </ div>")
				.appendTo ("body")
				.addClass (options.className)
				.css ({
					top: startPosition.top - fixTop,
					left: startPosition.left - fixLeft,
					height: element.innerHeight (),
					width: element.innerWidth (),
					position: targetFixed? "fixo": "absoluto"
				})
				.animate (animação, options.duration, options.easing, function () {
					transfer.remove ();
					if ($ .isFunction (done)) {
						feito();
					}
				});
	}
});

função parseClip (str, element) {
		var outerWidth = element.outerWidth (),
			outerHeight = element.outerHeight (),
			clipRegex = /^rect\((??\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-? \ d +% | auto),? \ s * (-? \ d * \. \ d * px | -? \ d +% | auto),? \ s * (-? \ d * \.? \ d * px | -? \ d +% | auto) \) $ /,
			valores = clipRegex.exec (str) || ["", 0, outerWidth, outerHeight, 0];

		Retorna {
			top: parseFloat (valores [1]) || 0,
			right: valores [2] === "auto"? outerWidth: parseFloat (valores [2]),
			bottom: values ​​[3] === "auto"? outerHeight: parseFloat (valores [3]),
			left: parseFloat (valores [4]) || 0
		};
}

$ .fx.step.clip = function (fx) {
	if (! fx.clipInit) {
		fx.start = $ (fx.elem) .cssClip ();
		if (typeof fx.end === "string") {
			fx.end = parseClip (fx.end, fx.elem);
		}
		fx.clipInit = true;
	}

	$ (fx.elem) .cssClip ({
		top: fx.pos * (fx.end.top - fx.start.top) + fx.start.top,
		direita: fx.pos * (fx.end.right - fx.start.right) + fx.start.right,
		bottom: fx.pos * (fx.end.bottom - fx.start.bottom) + fx.start.bottom,
		à esquerda: fx.pos * (fx.end.left - fx.start.left) + fx.start.left
	});
};

}) ();

/ ************************************************* ***************************** /
/ *********************************** EASING ************* ********************** /
/ ************************************************* ***************************** /

(function () {

// Baseado em facilitar as equações de Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$ .each (["Quad", "Cubic", "Quart", "Quint", "Expo"], função (i, nome) {
	baseEasings [name] = function (p) {
		retorna Math.pow (p, i + 2);
	};
});

$ .extend (baseEasings, {
	Sine: function (p) {
		return 1 - Math.cos (p * Math.PI / 2);
	}
	Circ: function (p) {
		return 1 - Math.sqrt (1 - p * p);
	}
	Elastic: function (p) {
		devolve p === 0 || p === 1? p:
			-Math.pow (2, 8 * (p - 1)) * Math.sin (((p - 1) * 80 - 7,5) * Math.PI / 15);
	}
	Voltar: função (p) {
		devolve p * p * (3 * p - 2);
	}
	Bounce: função (p) {
		var pow2,
			ressalto = 4;

		while (p <((pow2 = Math.pow (2, --bounce)) - 1) / 11) {}
		return 1 / Math.pow (4, 3-bounce) - 7.5625 * Math.pow ((pow2 * 3 - 2) / 22 - p, 2);
	}
});

$ .each (baseEasings, function (name, easeIn) {
	$ .easing ["easeIn" + nome] = easeIn;
	$ .easing ["easeOut" + nome] = function (p) {
		return 1 - easeIn (1 - p);
	};
	$ .easing ["easeInOut" + nome] = function (p) {
		devolve p <0,5?
			easeIn (p * 2) / 2:
			1 - easeIn (p * -2 + 2) / 2;
	};
});

}) ();

var effect = $ .effects;


/ *!
 * jQuery UI Effects Blind 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: efeito cego
// >> group: efeitos
// >> description: Blinds the element.
// >> docs: http://api.jqueryui.com/blind-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectBlind = $ .effects.define ("cego", "ocultar", função (opções, feito) {
	var map = {
			up: ["bottom", "top"],
			vertical: ["bottom", "top"],
			down: ["top", "bottom"],
			esquerda: ["direita", "esquerda"],
			horizontal: ["direita", "esquerda"],
			direita: ["esquerda", "direita"]
		}
		element = $ (this),
		direção = options.direction || "acima",
		start = element.cssClip (),
		animate = {clip: $ .extend ({}, start)},
		espaço reservado = $ .effects.createPlaceholder (element);

	animate.clip [mapa [direção] [0]] = animate.clip [mapa [direção] [1]];

	if (options.mode === "show") {
		element.cssClip (animate.clip);
		if (marcador de posição) {
			placeholder.css ($ .effects.clipToBox (animate));
		}

		animate.clip = start;
	}

	if (marcador de posição) {
		placeholder.animate ($ .effects.clipToBox (animate), options.duration, options.easing);
	}

	element.animate (animar, {
		fila: falso
		duração: options.duration,
		easing: options.easing,
		completo: feito
	});
});


/ *!
 * jQuery UI Effects Bounce 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Efeito Bounce
// >> group: efeitos
// >> description: Salta um elemento horizontalmente ou verticalmente n vezes.
// >> docs: http://api.jqueryui.com/bounce-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectBounce = $ .effects.define ("rejeição", função (opções, feito) {
	var upAnim, downAnim, refValue,
		element = $ (this),

		// Padrões:
		mode = options.mode,
		esconder = modo == "esconder",
		show = mode === "show",
		direção = options.direction || "acima",
		distance = options.distance,
		times = options.times || 5,

		// Número de animações internas
		anims = times * 2 + (mostre || ocultar? 1: 0),
		velocidade = opções.duração / anims
		easing = options.easing,

		// Utilitário:
		ref = (direção === "up" || direção === "down")? "top": "esquerda",
		movimento = (direção === "acima" || direção === "esquerda"),
		i = 0,

		queuelen = element.queue (). length;

	$ .effects.createPlaceholder (element);

	refValue = element.css (ref);

	// Distância padrão para o maior salto é a distância externa / 3
	if (! distance) {
		distance = element [ref === "top"? "outerHeight": "outerWidth"] () / 3;
	}

	if (show) {
		downAnim = {opacidade: 1};
		downAnim [ref] = refValue;

		// Se estivermos mostrando, force a opacidade 0 e defina a posição inicial
		// então faça a animação "primeiro"
		elemento
			.css ("opacidade", 0)
			.css (ref, movimento? -distância * 2: distância * 2)
			.animado (para baixoAnim, velocidade, facilitação);
	}

	// Comece pela menor distância se estivermos nos escondendo
	if (hide) {
		distância = distância / Math.pow (2, vezes - 1);
	}

	downAnim = {};
	downAnim [ref] = refValue;

	// Salta para cima / baixo / esquerda / direita e volta para 0 - vezes * 2 animações acontecem aqui
	para (; i <times; i ++) {
		upAnim = {};
		upAnim [ref] = (movimento? "- =": "+ =") + distância;

		elemento
			.animado (upAnim, velocidade, facilitando)
			.animado (para baixoAnim, velocidade, facilitação);

		distância = ocultar? distância * 2: distância / 2;
	}

	// Última rejeição ao esconder
	if (hide) {
		upAnim = {opacidade: 0};
		upAnim [ref] = (movimento? "- =": "+ =") + distância;

		element.animate (upAnim, velocidade, facilitação);
	}

	element.queue (feito);

	$ .effects.unshift (elemento, queuelen, anims + 1);
});


/ *!
 * jQuery UI Effects Clip 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Efeito Clip
// >> group: efeitos
// >> description: Liga e desliga o elemento como uma TV antiga.
// >> docs: http://api.jqueryui.com/clip-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectClip = $ .effects.define ("clipe", "esconder", função (opções, feito) {
	var start,
		animar = {},
		element = $ (this),
		direção = options.direction || "vertical",
		ambos = direção === "ambos",
		horizontal = ambos || direção === "horizontal",
		vertical = ambos || direção === "vertical";

	start = element.cssClip ();
	animate.clip = {
		topo: vertical? (start.bottom - start.top) / 2: start.top,
		direita: horizontal? (start.right - start.left) / 2: start.right,
		fundo: vertical? (start.bottom - start.top) / 2: start.bottom,
		esquerda: horizontal? (start.right - start.left) / 2: start.left
	};

	$ .effects.createPlaceholder (element);

	if (options.mode === "show") {
		element.cssClip (animate.clip);
		animate.clip = start;
	}

	element.animate (animar, {
		fila: falso
		duração: options.duration,
		easing: options.easing,
		completo: feito
	});

});


/ *!
 * jQuery UI Effects Drop 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Drop Effect
// >> group: efeitos
// >> description: Move um elemento em uma direção e oculta-o ao mesmo tempo.
// >> docs: http://api.jqueryui.com/drop-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectDrop = $ .effects.define ("soltar", "ocultar", função (opções, concluído) {

	var distância,
		element = $ (this),
		mode = options.mode,
		show = mode === "show",
		direção = options.direction || "esquerda",
		ref = (direção === "up" || direção === "down")? "top": "esquerda",
		movimento = (direção === "acima" || direção === "esquerda")? "- =": "+ =",
		oppositeMotion = (movimento === "+ =")? "- =": "+ =",
		animação = {
			opacidade: 0
		};

	$ .effects.createPlaceholder (element);

	distance = options.distance ||
		elemento [ref === "top"? "outerHeight": "outerWidth"] (true) / 2;

	animação [ref] = movimento + distância;

	if (show) {
		element.css (animação);

		animação [ref] = oppositeMotion + distance;
		animation.opacity = 1;
	}

	// Animate
	element.animate (animação, {
		fila: falso
		duração: options.duration,
		easing: options.easing,
		completo: feito
	});
});


/ *!
 * jQuery UI Effects Explodir 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Explode Effect
// >> group: efeitos
// jscs: disable maximumLineLength
// >> description: Explode um elemento em todas as direções em n partes. Implode um elemento em sua integridade original.
// jscs: enable maximumLineLength
// >> docs: http://api.jqueryui.com/explode-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectExplode = $ .effects.define ("explode", "esconde", função (opções, feito) {

	var i, j, esquerda, superior, mx, meu,
		linhas = opções.pieces? Math.round (Math.sqrt (options.pieces)): 3,
		células = linhas
		element = $ (this),
		mode = options.mode,
		show = mode === "show",

		// Mostrar e, em seguida, visibilidade: ocultou o elemento antes de calcular o deslocamento
		offset = element.show (). css ("visibilidade", "oculto") .offset (),

		// Largura e altura de uma peça
		width = Math.ceil (element.outerWidth () / cells),
		height = Math.ceil (element.outerHeight () / linhas),
		pedaços = [];

	// animar crianças completas:
	function childComplete () {
		pieces.push (isso);
		if (pieces.length === linhas * células) {
			animComplete ();
		}
	}

	// Clone o elemento para cada linha e célula.
	para (i = 0; i <linhas; i ++) {// ===>
		top = offset.top + i * height;
		meu = i - (linhas - 1) / 2;

		para (j = 0; j <células; j ++) {// |||
			left = offset.left + j * width;
			mx = j - (células - 1) / 2;

			// Cria um clone do elemento principal agora oculto que será posicionado absoluto
			// dentro de um wrapper div off the -left e -top igual ao tamanho de nossas peças
			elemento
				.clone()
				.appendTo ("body")
				.wrap ("<div> </ div>")
				.css ({
					posição: "absoluto",
					visibilidade: "visível",
					esquerda: -j * largura
					topo: -i * altura
				})

				// Selecione o wrapper - faça o overflow: oculto e absoluto posicionado com base em
				// onde o original estava localizado + left e + top igual ao tamanho das peças
				.parent ()
					.addClass ("ui-effects-explode")
					.css ({
						posição: "absoluto",
						estouro: "oculto",
						largura: largura
						altura: altura
						esquerda: esquerda + (mostra? mx * largura: 0),
						top: top + (mostra? minha * altura: 0),
						opacidade: show? 0: 1
					})
					.animate ({
						esquerda: esquerda + (mostra? 0: mx * largura),
						top: top + (mostra? 0: minha * altura),
						opacidade: show? 1: 0
					}, options.duration || 500, options.easing, childComplete);
		}
	}

	function animComplete () {
		element.css ({
			visibilidade: "visível"
		});
		$ (peças) .remove ();
		feito();
	}
});


/ *!
 * jQuery UI Effects desvanecem-se 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Fade Effect
// >> group: efeitos
// >> description: Desvanece o elemento.
// >> docs: http://api.jqueryui.com/fade-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectFade = $ .effects.define ("fade", "toggle", função (opções, feito) {
	var show = options.mode === "show";

	$ (isso)
		.css ("opacidade", show? 0: 1)
		.animate ({
			opacidade: show? 1: 0
		}, {
			fila: falso
			duração: options.duration,
			easing: options.easing,
			completo: feito
		});
});


/ *!
 * jQuery UI Effects Fold 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Fold Effect
// >> group: efeitos
// >> description: Dobre um elemento primeiro horizontalmente e depois verticalmente.
// >> docs: http://api.jqueryui.com/fold-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectFold = $ .effects.define ("fold", "ocultar", função (opções, concluído) {

	// Cria elemento
	var element = $ (this),
		mode = options.mode,
		show = mode === "show",
		esconder = modo == "esconder",
		size = options.size || 15,
		por cento = / ([0-9] +)% /. exec (tamanho),
		horizFirst = !! options.horizFirst,
		ref = horizFirst? ["right", "bottom"]: ["bottom", "right"],
		duração = options.duration / 2,

		espaço reservado = $ .effects.createPlaceholder (element),

		start = element.cssClip (),
		animation1 = {clip: $ .extend ({}, start)},
		animation2 = {clip: $ .extend ({}, start)},

		distance = [start [ref [0]], inicie [ref [1]]],

		queuelen = element.queue (). length;

	se (por cento) {
		size = parseInt (por cento [1], 10) / 100 * distância [ocultar? 0: 1];
	}
	animation1.clip [ref [0]] = tamanho;
	animation2.clip [ref [0]] = tamanho;
	animation2.clip [ref [1]] = 0;

	if (show) {
		element.cssClip (animation2.clip);
		if (marcador de posição) {
			placeholder.css ($ .effects.clipToBox (animação2));
		}

		animation2.clip = start;
	}

	// Animate
	elemento
		.queue (função (próximo) {
			if (marcador de posição) {
				placeholder
					.animate ($ .effects.clipToBox (animation1), duração, options.easing)
					.animate ($ .effects.clipToBox (animation2), duração, options.easing);
			}

			Próximo();
		})
		.animate (animation1, duração, options.easing)
		.animate (animation2, duração, options.easing)
		.queue (feito);

	$ .effects.unshift (elemento, queuelen, 4);
});


/ *!
 * Efeitos de UI do jQuery Destaque 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: destaque efeito
// >> group: efeitos
// >> description: Realça o plano de fundo de um elemento em uma cor definida por uma duração personalizada.
// >> docs: http://api.jqueryui.com/highlight-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectHighlight = $ .effects.define ("destaque", "show", função (opções, feito) {
	var element = $ (this),
		animação = {
			backgroundColor: element.css ("backgroundColor")
		};

	if (options.mode === "ocultar") {
		animation.opacity = 0;
	}

	$ .effects.saveStyle (elemento);

	elemento
		.css ({
			backgroundImage: "none",
			backgroundColor: options.color || "# ffff99"
		})
		.animate (animação, {
			fila: falso
			duração: options.duration,
			easing: options.easing,
			completo: feito
		});
});


/ *!
 * jQuery UI Effects Tamanho 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Size Effect
// >> group: efeitos
// >> description: Redimensiona um elemento para uma largura e altura especificadas.
// >> docs: http://api.jqueryui.com/size-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectSize = $ .effects.define ("tamanho", função (opções, feito) {

	// Cria elemento
	var linha de base, fator, temp,
		element = $ (this),

		// Copiar para crianças
		cProps = ["fontSize"],
		vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
		hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],

		// Definir opções
		mode = options.mode,
		restaurar = modo! == "efeito",
		escala = options.scale || "ambos",
		origem = options.origin || ["meio", "centro"],
		position = element.css ("position"),
		pos = element.position (),
		original = $ .effects.scaledDimensions (elemento),
		from = options.from || original,
		to = options.to || $ .effects.scaledDimensions (elemento, 0);

	$ .effects.createPlaceholder (element);

	if (modo === "show") {
		temp = from;
		de = para;
		para = temp;
	}

	// Definir o fator de escala
	fator = {
		de: {
			y: from.height / original.height,
			x: from.width / original.width
		}
		para: {
			y: to.height / original.height,
			x: to.width / original.width
		}
	};

	// Escala a caixa css
	if (scale === "box" || scale === "both") {

		// Escala vertical de adereços
		if (factor.from.y! == factor.to.y) {
			from = $ .effects.setTransition (elemento, vProps, factor.from.y, de);
			para = $ .effects.setTransition (elemento, vProps, factor.to.y, para);
		}

		// Horizontal props scaling
		if (factor.from.x! == factor.to.x) {
			from = $ .effects.setTransition (elemento, hProps, factor.from.x, de);
			para = $ .effects.setTransition (element, hProps, factor.to.x, para);
		}
	}

	// Escala o conteúdo
	if (scale === "content" || scale === "both") {

		// Escala vertical de adereços
		if (factor.from.y! == factor.to.y) {
			from = $ .effects.setTransition (elemento, cProps, factor.from.y, de);
			para = $ .effects.setTransition (elemento, cProps, factor.to.y, para);
		}
	}

	// Ajuste as propriedades da posição com base nos pontos de origem fornecidos
	if (origin) {
		linha de base = $ .effects.getBaseline (origem, original);
		from.top = (original.outerHeight - from.outerHeight) * baseline.y + pos.top;
		from.left = (original.outerWidth - from.outerWidth) * baseline.x + pos.left;
		to.top = (original.outerHeight - to.outerHeight) * baseline.y + pos.top;
		to.left = (original.outerWidth - to.outerWidth) * baseline.x + pos.left;
	}
	element.css (de);

	// Animar as crianças, se desejar
	if (scale === "content" || scale === "both") {

		vProps = vProps.concat (["marginTop", "marginBottom"]) .concat (cProps);
		hProps = hProps.concat (["marginLeft", "marginRight"]);

		// Apenas animar filhos com atributos de largura especificados
		// TODO: está certo? devemos incluir qualquer coisa com largura css especificada também
		element.find ("* [width]") .each (function () {
			var child = $ (this),
				childOriginal = $ .effects.scaledDimensions (child),
				childFrom = {
					height: childOriginal.height * factor.from.y,
					width: childOriginal.width * factor.from.x,
					outerHeight: childOriginal.outerHeight * factor.from.y,
					outerWidth: childOriginal.outerWidth * factor.from.x
				}
				childTo = {
					height: childOriginal.height * factor.to.y,
					width: childOriginal.width * factor.to.x,
					outerHeight: childOriginal.height * factor.to.y,
					outerWidth: childOriginal.width * factor.to.x
				};

			// Escala vertical de adereços
			if (factor.from.y! == factor.to.y) {
				childFrom = $ .effects.setTransition (filho, vProps, factor.from.y, childFrom);
				childTo = $ .effects.setTransition (filho, vProps, factor.to.y, childTo);
			}

			// Horizontal props scaling
			if (factor.from.x! == factor.to.x) {
				childFrom = $ .effects.setTransition (filho, hProps, factor.from.x, childFrom);
				childTo = $ .effects.setTransition (filho, hProps, factor.to.x, childTo);
			}

			if (restaurar) {
				$ .effects.saveStyle (filho);
			}

			// Animar crianças
			child.css (childFrom);
			child.animate (childTo, options.duration, options.easing, function () {

				// Restaurar crianças
				if (restaurar) {
					$ .effects.restoreStyle (filho);
				}
			});
		});
	}

	// Animate
	element.animate (to, {
		fila: falso
		duração: options.duration,
		easing: options.easing,
		complete: function () {

			var offset = element.offset ();

			if (to.opacity === 0) {
				element.css ("opacidade", from.opacity);
			}

			if (! restaurar) {
				elemento
					.css ("position", position === "static"? "relative": posição)
					offset (deslocamento);

				// Precisa salvar o estilo aqui para que a restauração automática de estilo
				// não restaura os estilos originais antes da animação.
				$ .effects.saveStyle (elemento);
			}

			feito();
		}
	});

});


/ *!
 * jQuery UI Scale Effects 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Scale Effect
// >> group: efeitos
// >> description: Aumenta ou diminui um elemento e seu conteúdo.
// >> docs: http://api.jqueryui.com/scale-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectScale = $ .effects.define ("escala", função (opções, feito) {

	// Cria elemento
	var el = $ (this),
		mode = options.mode,
		percent = parseInt (options.percent, 10) ||
			(parseInt (options.percent, 10) === 0? 0: (modo! == "efeito"? 0: 100)),

		newOptions = $ .extend (true, {
			from: $ .effects.scaledDimensions (el),
			para: $ .effects.scaledDimensions (el, percent, options.direction || "both"),
			origem: options.origin || ["meio", "centro"]
		}, opções);

	// Fade opção para apoiar puff
	if (options.fade) {
		newOptions.from.opacity = 1;
		newOptions.to.opacity = 0;
	}

	$ .effects.effect.size.call (this, newOptions, done);
});


/ *!
 * jQuery UI Effects Puff 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Puff Effect
// >> group: efeitos
// >> description: Cria um efeito puff escalonando o elemento e ocultando-o ao mesmo tempo.
// >> docs: http://api.jqueryui.com/puff-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectPuff = $ .effects.define ("puff", "ocultar", função (opções, concluído) {
	var newOptions = $ .extend (true, {}, opções, {
		fade: verdadeiro
		por cento: parseInt (options.percent, 10) || 150
	});

	$ .effects.effect.scale.call (this, newOptions, done);
});


/ *!
 * jQuery UI Effects Pulsar 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Pulsate Effect
// >> group: efeitos
// >> description: Pulsa um elemento n vezes alterando a opacidade para zero e vice-versa.
// >> docs: http://api.jqueryui.com/pulsate-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectPulsate = $ .effects.define ("pulsar", "mostrar", função (opções, concluído) {
	var element = $ (this),
		mode = options.mode,
		show = mode === "show",
		esconder = modo == "esconder",
		showhide = show || ocultar,

		// Mostrando ou ocultando deixa a "última" animação
		anims = ((options.times || 5) * 2) + (showhide? 1: 0),
		duração = options.duration / anims,
		animateTo = 0,
		i = 1,
		queuelen = element.queue (). length;

	if (show ||! element.is (": visible")) {
		element.css ("opacidade", 0) .show ();
		animateTo = 1;
	}

	// Anims - 1 opacidade "alterna"
	para (; i <anims; i ++) {
		element.animate ({opacidade: animateTo}, duração, options.easing);
		animateTo = 1 - animateTo;
	}

	element.animate ({opacidade: animateTo}, duração, options.easing);

	element.queue (feito);

	$ .effects.unshift (elemento, queuelen, anims + 1);
});


/ *!
 * jQuery UI Effects Agitar 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Shake Effect
// >> group: efeitos
// >> description: Agita um elemento horizontalmente ou verticalmente n vezes.
// >> docs: http://api.jqueryui.com/shake-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectShake = $ .effects.define ("agitar", função (opções, feito) {

	var i = 1,
		element = $ (this),
		direção = options.direction || "esquerda",
		distance = options.distance || 20,
		times = options.times || 3,
		anims = times * 2 + 1,
		velocidade = Math.round (options.duration / anims),
		ref = (direção === "up" || direção === "down")? "top": "esquerda",
		positiveMotion = (direção === "acima" || direção === "esquerda"),
		animação = {}
		animation1 = {},
		animação2 = {},

		queuelen = element.queue (). length;

	$ .effects.createPlaceholder (element);

	// Animação
	animação [ref] = (positiveMotion? "- =": "+ =") + distância;
	animation1 [ref] = (positiveMotion? "+ =": "- =") + distância * 2;
	animation2 [ref] = (positiveMotion? "- =": "+ =") + distância * 2;

	// Animate
	element.animate (animação, velocidade, options.easing);

	// Shakes
	para (; i <times; i ++) {
		elemento
			.animate (animation1, speed, options.easing)
			.animate (animation2, speed, options.easing);
	}

	elemento
		.animate (animation1, speed, options.easing)
		.animate (animação, velocidade / 2, options.easing)
		.queue (feito);

	$ .effects.unshift (elemento, queuelen, anims + 1);
});


/ *!
 * jQuery UI Effects Slide 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Slide Effect
// >> group: efeitos
// >> description: Desliza um elemento dentro e fora da viewport.
// >> docs: http://api.jqueryui.com/slide-effect/
// >> demos: http://jqueryui.com/effect/



var effectsEffectSlide = $ .effects.define ("slide", "show", função (opções, feito) {
	var startClip, startRef,
		element = $ (this),
		map = {
			up: ["bottom", "top"],
			down: ["top", "bottom"],
			esquerda: ["direita", "esquerda"],
			direita: ["esquerda", "direita"]
		}
		mode = options.mode,
		direção = options.direction || "esquerda",
		ref = (direção === "up" || direção === "down")? "top": "esquerda",
		positiveMotion = (direção === "acima" || direção === "esquerda"),
		distance = options.distance ||
			elemento [ref === "top"? "outerHeight": "outerWidth"] (true),
		animação = {};

	$ .effects.createPlaceholder (element);

	startClip = element.cssClip ();
	startRef = element.position () [ref];

	// Definir hide animation
	animação [ref] = (positiveMotion? -1: 1) * distance + startRef;
	animation.clip = element.cssClip ();
	animation.clip [map [direção] [1]] = animação.clip [mapa [direção] [0]];

	// Inverta a animação se estivermos mostrando
	if (modo === "show") {
		element.cssClip (animation.clip);
		element.css (ref, animação [ref]);
		animation.clip = startClip;
		animação [ref] = startRef;
	}

	// Realmente animar
	element.animate (animação, {
		fila: falso
		duração: options.duration,
		easing: options.easing,
		completo: feito
	});
});


/ *!
 * jQuery UI Effects Transfer 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Transfer Effect
// >> group: efeitos
// >> description: Exibe um efeito de transferência de um elemento para outro.
// >> docs: http://api.jqueryui.com/transfer-effect/
// >> demos: http://jqueryui.com/effect/



efeito var;
if ($ .uiBackCompat! == false) {
	effect = $ .effects.define ("transfer", function (opções, feito) {
		$ (this) .transfer (opções, feito);
	});
}
var effectsEffectTransfer = efeito;


/ *!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label:: Seletor focável
// >> group: Core
// >> description: Seleciona elementos que podem ser focados.
// >> docs: http://api.jqueryui.com/focusable-selector/



// Seletores
$ .ui.focusable = function (elemento, hasTabindex) {
	var map, mapName, img, focusableIfVisible, fieldset,
		nodeName = element.nodeName.toLowerCase ();

	if ("área" === nodeName) {
		map = element.parentNode;
		mapName = map.name;
		if (! element.href ||! mapName || map.nodeName.toLowerCase ()! == "map") {
			retorna falso;
		}
		img = $ ("img [usemap = '#" + nome do mapa + "']");
		return img.length> 0 && img.is (": visible");
	}

	if (/ ^ (input | select | textarea | botão | objeto) $ /. test (nodeName)) {
		focusableIfVisible =! element.disabled;

		if (focusableIfVisible) {

			// Os controles de formulário em um campo desativado estão desativados.
			// No entanto, os controles dentro da legenda do fieldset não são desabilitados.
			// Como os controles geralmente não são colocados dentro de legendas, pulamos
			// esta parte do cheque.
			fieldset = $ (elemento) .closest ("conjunto de campos") [0];
			if (fieldset) {
				focusableIfVisible =! fieldset.disabled;
			}
		}
	} else if ("a" === nodeName) {
		focusableIfVisible = element.href || hasTabindex;
	} outro {
		focusableIfVisible = hasTabindex;
	}

	return focusableIfVisible && $ (element) .is (": visible") && visible ($ (elemento));
};

// Suporte: somente no IE 8
// IE 8 não resolve herdar para visível / oculto para valores computados
função visible (element) {
	var visibility = element.css ("visibilidade");
	while (visibilidade === "herdar") {
		element = element.parent ();
		visibilidade = element.css ("visibilidade");
	}
	retornar visibilidade! == "oculto";
}

$ .extend ($ .expr [":"], {
	focusable: function (element) {
		return $ .ui.focusable (elemento, $ .attr (elemento, "tabindex")! = null);
	}
});

var focusable = $ .ui.focusable;




// Suporte: Somente IE8
// O IE8 não suporta o atributo form e quando é fornecido. Sobrescreve a forma prop
// com uma string, então precisamos encontrar o formulário apropriado.
var form = $ .fn.form = function () {
	return typeof this [0] .form === "string"? this.closest ("form"): $ (this [0] .form);
};


/ *!
 * jQuery UI Form Reset Mixin 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Form Reset Mixin
// >> group: Core
// >> description: Atualizar widgets de entrada quando o formulário é redefinido
// >> docs: http://api.jqueryui.com/form-reset-mixin/



var formResetMixin = $ .ui.formResetMixin = {
	_formResetHandler: function () {
		var form = $ (this);

		// Aguarde a redefinição do formulário realmente acontecer antes de atualizar
		setTimeout (function () {
			var instances = form.data ("ui-form-reset-instances");
			$ .each (instâncias, função () {
				this.refresh ();
			});
		});
	}

	_bindFormResetHandler: function () {
		this.form = this.element.form ();
		if (! this.form.length) {
			Retorna;
		}

		var instances = this.form.data ("ui-form-reset-instances") || [];
		if (! instances.length) {

			// Não usamos _on () aqui porque usamos um único manipulador de eventos por formulário
			this.form.on ("reset.ui-form-reset", this._formResetHandler);
		}
		instances.push (this);
		this.form.data ("ui-form-reset-instances", instâncias);
	}

	_unbindFormResetHandler: function () {
		if (! this.form.length) {
			Retorna;
		}

		var instances = this.form.data ("ui-form-reset-instances");
		instances.splice ($ .inArray (isto, instâncias), 1);
		if (instances.length) {
			this.form.data ("ui-form-reset-instances", instâncias);
		} outro {
			essa forma
				.removeData ("ui-form-reset-instances")
				.off ("reset.ui-form-reset");
		}
	}
};


/ *!
 * jQuery UI Support para o jQuery core 1.7.x 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 *
 * /

// >> label: Suporte ao jQuery 1.7
// >> group: Core
// >> description: Suporte a versão 1.7.x do núcleo do jQuery



// Suporte: somente jQuery 1.7
// Não é uma ótima maneira de verificar versões, mas como nós só suportamos 1.7+ e somente
// precisa detectar <1.8, essa é uma verificação simples que deve ser suficiente. Verificação
// para "1.7". seria um pouco mais seguro, mas a string de versão é 1.7, não 1.7.0
// e nunca chegaremos a 1,70.0 (se o fizermos, certamente não estaremos apoiando
// 1.7 mais). Veja # 11197 por que não estamos usando a detecção de recursos.
if ($ .fn.jquery.substring (0, 3) === "1.7") {

	// Setters para .innerWidth (), .innerHeight (), .outerWidth (), .outerHeight ()
	// Ao contrário do jQuery Core 1.8+, eles suportam apenas valores numéricos para definir
	// dimensões em pixels
	$ .each (["Width", "Height"], função (i, nome) {
		var side = name === "Largura"? ["Left", "Right"]: ["Top", "Bottom"],
			type = name.toLowerCase (),
			orig = {
				innerWidth: $ .fn.innerWidth,
				innerHeight: $ .fn.innerHeight,
				outerWidth: $ .fn.outerWidth,
				outerHeight: $ .fn.outerHeight
			};

		função reduce (elem, size, border, margin) {
			$ .each (lado, função () {
				size - = parseFloat ($ .css (elem, "preenchimento" + isso)) || 0;
				if (border) {
					size - = parseFloat ($ .css (elem, "border" + this + "Width")) || 0;
				}
				if (margin) {
					size - = parseFloat ($ .css (elem, "margin" + this)) || 0;
				}
			});
			tamanho de retorno;
		}

		$ .fn ["inner" + name] = função (tamanho) {
			if (tamanho === indefinido) {
				return orig ["inner" + nome] .call (isto);
			}

			return this.each (function () {
				$ (this) .css (digite, reduza (isso, tamanho) + "px");
			});
		};

		$ .fn ["outer" + name] = função (tamanho, margem) {
			if (tipo de tamanho! == "numero") {
				return orig ["exterior" + nome] .call (isto, tamanho);
			}

			return this.each (function () {
				$ (this) .css (tipo, reduzir (isto, tamanho, verdadeiro, margem) + "px");
			});
		};
	});

	$ .fn.addBack = function (selector) {
		return this.add (selector == null?
			this.prevObject: this.prevObject.filter (seletor)
		);
	};
}

;
/ *!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Keycode
// >> group: Core
// >> description: Fornece códigos de teclas como nomes-chave
// >> docs: http://api.jqueryui.com/jQuery.ui.keyCode/


var keycode = $ .ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	CASA: 36,
	ESQUERDA: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERÍODO: 190,
	À DIREITA: 39,
	ESPAÇO: 32,
	TAB: 9,
	UP: 38
};




// Somente para uso interno
var escapeSelector = $ .ui.escapeSelector = (function () {
	var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
	função de retorno (seletor) {
		return selector.replace (selectorEscape, "\\ $ 1");
	};
}) ();


/ *!
 * jQuery UI Labels 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: labels
// >> group: Core
// >> description: encontre todos os rótulos associados a uma determinada entrada
// >> docs: http://api.jqueryui.com/labels/



var labels = $ .fn.labels = function () {
	var ancestor, selector, id, labels, ancestors;

	// Verifique control.labels primeiro
	if (this [0] .labels && this [0] .labels.length) {
		return this.pushStack (este [0] .labels);
	}

	// Suporte: IE <= 11, FF <= 37, Android <= 2,3 apenas
	// Acima dos navegadores não suportam control.labels. Tudo abaixo é para apoiá-los
	// assim como fragmentos de documentos. control.labels não funciona em fragmentos de documentos
	labels = this.eq (0) .parents ("label");

	// Procure o rótulo com base no id
	id = this.attr ("id");
	if (id) {

		// Não procuramos o documento no caso do elemento
		// está desconectado do DOM
		ancestral = this.eq (0) .parents (). last ();

		// Obter um conjunto completo de antepassados ​​de nível superior
		ancestors = ancestor.add (ancestor.length? ancestor.siblings (): this.siblings ());

		// Cria um seletor para o rótulo com base no id
		selector = "label [for = '" + $ .ui.escapeSelector (id) + "']";

		labels = labels.add (ancestors.find (seletor) .addBack (seletor));

	}

	// Devolve tudo o que encontrámos para etiquetas
	return this.pushStack (rótulos);
};


/ *!
 * jQuery UI Scroll Parent 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: scrollParent
// >> group: Core
// >> description: Obtenha o elemento ancestral mais próximo que pode ser rolado.
// >> docs: http://api.jqueryui.com/scrollParent/



var scrollParent = $ .fn.scrollParent = function (includeHidden) {
	var position = this.css ("posição"),
		excludeStaticParent = position === "absolute",
		overflowRegex = includeHidden? / (auto | rolagem | oculto) /: / (automático | rolagem) /,
		scrollParent = this.parents (). filter (function () {
			var parent = $ (this);
			if (excludeStaticParent && parent.css ("position") === "static") {
				retorna falso;
			}
			return overflowRegex.test (parent.css ("estouro") + parent.css ("overflow-y") +
				parent.css ("overflow-x"));
		}) eq (0);

	posição de retorno === "fixed" || ! scrollParent.length?
		$ (this [0] .ownerDocument || document):
		scrollParent;
};


/ *!
 * jQuery UI Tabbable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label:: Seletor de tabulação
// >> group: Core
// >> description: Seleciona elementos que podem ser tabulados.
// >> docs: http://api.jqueryui.com/tabbable-selector/



var tabbable = $ .extend ($ .expr [":"], {
	tabbable: function (element) {
		var tabIndex = $ .attr (elemento, "tabindex"),
			hasTabindex = tabIndex! = null;
		return (! hasTabindex || tabIndex> = 0) && $ .ui.focusable (elemento, hasTabindex);
	}
});


/ *!
 * ID Exclusiva da IU do jQuery 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: uniqueId
// >> group: Core
// >> description: Funções para gerar e remover uniqueId's
// >> docs: http://api.jqueryui.com/uniqueId/



var uniqueId = $ .fn.extend ({
	uniqueId: (function () {
		var uuid = 0;

		função de retorno () {
			return this.each (function () {
				if (! this.id) {
					this.id = "ui-id-" + (+ + uuid);
				}
			});
		};
	}) (),

	removeUniqueId: function () {
		return this.each (function () {
			if (/ ^ ui-id- \ d + $ /. test (this.id)) {
				$ (this) .removeAttr ("id");
			}
		});
	}
});


/ *!
 * jQuery UI Accordion 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: acordeão
// >> group: Widgets
// jscs: disable maximumLineLength
// >> description: Exibe painéis de conteúdo recolhíveis para apresentar informações em uma quantidade limitada de espaço.
// jscs: enable maximumLineLength
// >> docs: http://api.jqueryui.com/accordion/
// >> demos: http://jqueryui.com/accordion/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/accordion.css
//>>css.theme: ../../themes/base/theme.css



var widgetsAccordion = $ .widget ("ui.accordion", {
	versão: "1.12.1",
	opções: {
		ativo: 0,
		animar: {},
		classes: {
			"ui-accordion-header": "ui-canto-top",
			"ui-accordion-header-collapsed": "ui-canto-tudo",
			"ui-accordion-content": "ui-canto-fundo"
		}
		desmontável: falso
		evento: "clique",
		cabeçalho: "> li>: primeiro filho,>: não (li): até",
		heightStyle: "auto",
		ícones: {
			activeHeader: "ui-icon-triangle-1-s",
			cabeçalho: "ui-icon-triangle-1-e"
		}

		// Callbacks
		ativar: nulo,
		beforeActivate: null
	}

	hideProps: {
		borderTopWidth: "ocultar",
		borderBottomWidth: "ocultar",
		paddingTop: "ocultar",
		paddingBottom: "ocultar",
		altura: "esconder"
	}

	showProps: {
		borderTopWidth: "show",
		borderBottomWidth: "show",
		paddingTop: "show",
		paddingBottom: "show",
		altura: "show"
	}

	_create: function () {
		var options = this.options;

		this.prevShow = this.prevHide = $ ();
		this._addClass ("ui-accordion", "ui-widget ui-helper-reset");
		this.element.attr ("role", "tablist");

		// Não permitir recolhível: falso e ativo: falso / nulo
		if (! options.collapsible && (options.active === false || options.active == null))) {
			options.active = 0;
		}

		this._processPanels ();

		// manipular valores negativos
		if (options.active <0) {
			options.active + = this.headers.length;
		}
		this._refresh ();
	}

	_getCreateEventData: function () {
		Retorna {
			cabeçalho: this.active
			painel:! this.active.length? $ (): this.active.next ()
		};
	}

	_createIcons: function () {
		var ícone, crianças,
			ícones = this.options.icons;

		if (ícones) {
			ícone = $ ("<span>");
			this._addClass (ícone, "ui-accordion-header-icon", "ícone-ui" + icons.header);
			icon.prependTo (this.headers);
			children = this.active.children (".ui-accordion-header-icon");
			this._removeClass (filhos, icons.header)
				._addClass (filhos, null, icons.activeHeader)
				._addClass (this.headers, "ui-accordion-icons");
		}
	}

	_destroyIcons: function () {
		this._removeClass (this.headers, "ui-accordion-icons");
		this.headers.children (".ui-accordion-header-icon") .remove ();
	}

	_destroy: function () {
		var conteúdo;

		// Limpar o elemento principal
		this.element.removeAttr ("role");

		// Limpar cabeçalhos
		this.headers
			.removeAttr ("role aria-expandido aria-selected aria-controls tabIndex")
			.removeUniqueId ();

		this._destroyIcons ();

		// Limpar painéis de conteúdo
		contents = this.headers.next ()
			.css ("display", "")
			.removeAttr ("role aria-hidden aria-labelledby")
			.removeUniqueId ();

		if (this.options.heightStyle! == "conteúdo") {
			contents.css ("altura", "");
		}
	}

	_setOption: function (key, value) {
		if (chave === "ativo") {

			// _activate () manipulará valores inválidos e atualizará this.options
			this._activate (valor);
			Retorna;
		}

		if (chave === "evento") {
			if (this.options.event) {
				this._off (this.headers, this.options.event);
			}
			this._setupEvents (valor);
		}

		this._super (chave, valor);

		// Configuração recolhível: false durante o recolhimento; abra o primeiro painel
		if (chave === "colapsável" &&! value && this.options.active === false) {
			this._activate (0);
		}

		if (chave === "ícones") {
			this._destroyIcons ();
			if (valor) {
				this._createIcons ();
			}
		}
	}

	_setOptionDisabled: function (value) {
		this._super (valor);

		this.element.attr ("aria-disabled", valor);

		// Suporte: Somente IE8
		// # 5332 / # 6059 - a opacidade não cai em cascata para os elementos posicionados no IE
		// então precisamos adicionar a classe desativada aos cabeçalhos e painéis
		this._toggleClass (null, "ui-state-disabled", valor !!);
		this._toggleClass (this.headers.add (this.headers.next ()), null, "ui-state-disabled",
			!!valor );
	}

	_keydown: function (event) {
		if (event.altKey || event.ctrlKey) {
			Retorna;
		}

		var keyCode = $ .ui.keyCode,
			comprimento = this.headers.length,
			currentIndex = this.headers.index (event.target),
			toFocus = false;

		switch (event.keyCode) {
		case keyCode.RIGHT:
		case keyCode.DOWN:
			toFocus = this.headers [(currentIndex + 1)% length];
			quebrar;
		case keyCode.LEFT:
		case keyCode.UP:
			toFocus = this.headers [(currentIndex - 1 + comprimento)% length];
			quebrar;
		case keyCode.SPACE:
		case keyCode.ENTER:
			this._eventHandler (evento);
			quebrar;
		case keyCode.HOME:
			toFocus = this.headers [0];
			quebrar;
		case keyCode.END:
			toFocus = this.headers [comprimento - 1];
			quebrar;
		}

		if (toFocus) {
			$ (event.target) .attr ("tabIndex", -1);
			$ (toFocus) .attr ("tabIndex", 0);
			$ (toFocus) .trigger ("foco");
			event.preventDefault ();
		}
	}

	_panelKeyDown: function (event) {
		if (event.keyCode === $ .ui.keyCode.UP && event.ctrlKey) {
			$ (event.currentTarget) .prev (). trigger ("focus");
		}
	}

	refresh: function () {
		var options = this.options;
		this._processPanels ();

		// Foi recolhido ou nenhum painel
		if ((options.active === false && options.collapsible === true) ||
				! this.headers.length) {
			options.active = false;
			this.active = $ ();

		// ativo falso somente quando o colapso é verdadeiro
		} else if (options.active === false) {
			this._activate (0);

		// estava ativo, mas o painel ativo desapareceu
		} else if (this.active.length &&! $. contains (this.element [0], this.active [0])) {

			// todos os painéis restantes estão desativados
			if (this.headers.length === this.headers.find (". estado-desativado") .length) {
				options.active = false;
				this.active = $ ();

			// ativa o painel anterior
			} outro {
				this._activate (Math.max (0, options.active - 1));
			}

		// estava ativo, o painel ativo ainda existe
		} outro {

			// verifique se o índice ativo está correto
			options.active = this.headers.index (this.active);
		}

		this._destroyIcons ();

		this._refresh ();
	}

	_processPanels: function () {
		var prevHeaders = this.headers,
			prevPanels = this.panels;

		this.headers = this.element.find (this.options.header);
		this._addClass (this.headers, "ui-accordion-header ui-accordion-header-collapsed",
			"ui-state-default");

		this.panels = this.headers.next (). filter (": não (.ui-accordion-content-active)") .hide ();
		this._addClass (this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content");

		// Evite vazamentos de memória (# 10056)
		if (prevPanels) {
			this._off (prevHeaders.not (this.headers));
			this._off (prevPanels.not (this.panels));
		}
	}

	_refresh: function () {
		var maxHeight,
			options = this.options,
			heightStyle = options.heightStyle,
			pai = this.element.parent ();

		this.active = this._findActive (options.active);
		this._addClass (this.active, "ui-accordion-header-active", "ui-state-active")
			._removeClass (this.active, "ui-accordion-header-collapsed");
		this._addClass (this.active.next (), "ui-accordion-content-active");
		this.active.next (). show ();

		this.headers
			.attr ("role", "tab")
			.each (function () {
				var header = $ (this),
					headerId = header.uniqueId (). attr ("id"),
					panel = header.next (),
					panelId = panel.uniqueId (). attr ("id");
				header.attr ("aria-controls", panelId);
				panel.attr ("aria-labelledby", headerId);
			})
			.Próximo()
				.attr ("role", "tabpanel");

		this.headers
			.not (this.active)
				.attr ({
					"aria-selected": "false",
					"aria-expandido": "falso",
					tabIndex: -1
				})
				.Próximo()
					.attr ({
						"aria-hidden": "true"
					})
					.ocultar();

		// Certifique-se de que pelo menos um cabeçalho esteja na ordem de tabulação
		if (! this.active.length) {
			this.headers.eq (0) .attr ("tabIndex", 0);
		} outro {
			this.active.attr ({
				"aria-selected": "true",
				"aria-expandido": "true",
				tabIndex: 0
			})
				.Próximo()
					.attr ({
						"aria-hidden": "false"
					});
		}

		this._createIcons ();

		this._setupEvents (options.event);

		if (heightStyle === "preencher") {
			maxHeight = parent.height ();
			this.element.siblings (": visible") .each (function () {
				var elem = $ (this),
					position = elem.css ("position");

				if (position === "absolute" || position === "fixed") {
					Retorna;
				}
				maxHeight - = elem.outerHeight (true);
			});

			this.headers.each (function () {
				maxHeight - = $ (this) .outerHeight (true);
			});

			this.headers.next ()
				.each (function () {
					$ (this) .height (Math.max (0, maxHeight -
						$ (this) .innerHeight () + $ (this) .height ()));
				})
				.css ("estouro", "auto");
		} else if (heightStyle === "auto") {
			maxHeight = 0;
			this.headers.next ()
				.each (function () {
					var isVisible = $ (this) .is (": visible");
					if (! isVisible) {
						$ (this) .show ();
					}
					maxHeight = Math.max (maxHeight, $ (this) .css ("altura", "") .height ());
					if (! isVisible) {
						$ (this) .hide ();
					}
				})
				.height (maxHeight);
		}
	}

	_activate: function (index) {
		var active = this._findActive (index) [0];

		// Tentando ativar o painel já ativo
		if (ativo === this.active [0]) {
			Retorna;
		}

		// Tentando recolher, simule um clique no cabeçalho ativo no momento
		ativo = ativo || this.active [0];

		this._eventHandler ({
			alvo: ativo
			currentTarget: ativo,
			preventDefault: $ .noop
		});
	}

	_findActive: function (selector) {
		return typeof selector === "numero"? this.headers.eq (seletor): $ ();
	}

	_setupEvents: function (event) {
		var events = {
			keydown: "_keydown"
		};
		if (event) {
			$ .each (event.split (""), function (index, eventName) {
				events [eventName] = "_eventHandler";
			});
		}

		this._off (this.headers.add (this.headers.next ()));
		this._on (this.headers, eventos);
		this._on (this.headers.next (), {keydown: "_panelKeyDown"});
		this._hoverable (this.headers);
		this._focusable (this.headers);
	}

	_eventHandler: function (event) {
		var activeChildren, clickedChildren,
			options = this.options,
			active = this.active,
			clicado = $ (event.currentTarget),
			clickedIsActive = clicado [0] === ativo [0],
			colapso = clickedIsActive && options.collapsible,
			toShow = colapso? $ (): clicked.next (),
			toHide = active.next (),
			eventData = {
				oldHeader: ativo,
				oldPanel: toHide,
				newHeader: colapso? $ (): clicado,
				newPanel: toShow
			};

		event.preventDefault ();

		E se (

				// clicar no cabeçalho ativo, mas não colapsável
				(clickedIsActive &&! options.collapsible) ||

				// permite cancelar a ativação
				(this._trigger ("beforeActivate", event, eventData) === false)) {
			Retorna;
		}

		options.active = colapso? false: this.headers.index (clicado);

		// Quando a chamada para ._toggle () vem depois que a classe muda
		// isso causa um bug muito estranho no IE 8 (veja # 6720)
		this.active = clickedIsActive? $ (): clicado;
		this._toggle (eventData);

		// Alternar classes
		// classes de canto no cabeçalho ativo anteriormente permanecem após a animação
		this._removeClass (ativo, "ui-accordion-header-active", "ui-state-active");
		if (options.icons) {
			activeChildren = active.children (".ui-accordion-header-icon");
			this._removeClass (activeChildren, null, options.icons.activeHeader)
				._addClass (activeChildren, null, options.icons.header);
		}

		if (! clickedIsActive) {
			this._removeClass (clicado, "ui-accordion-header-collapsed")
				._addClass (clicado, "ui-accordion-header-active", "ui-state-active");
			if (options.icons) {
				clickedChildren = clicked.children (".ui-accordion-header-icon");
				this._removeClass (clickedChildren, null, options.icons.header)
					._addClass (clickedChildren, null, options.icons.activeHeader);
			}

			this._addClass (clicked.next (), "ui-accordion-content-active");
		}
	}

	_toggle: function (data) {
		var toShow = data.newPanel,
			toHide = this.prevShow.length? this.prevShow: data.oldPanel;

		// Lidar com a ativação de um painel durante a animação para outra ativação
		this.prevShow.add (this.prevHide) .stop (true, true);
		this.prevShow = toShow;
		this.prevHide = toHide;

		if (this.options.animate) {
			this._animate (toShow, toHide, data);
		} outro {
			toHide.hide ();
			toShow.show ();
			this._toggleComplete (dados);
		}

		toHide.attr ({
			"aria-hidden": "true"
		});
		toHide.prev (). attr ({
			"aria-selected": "false",
			"aria-expandido": "falso"
		});

		// se estamos mudando painéis, remova o cabeçalho antigo da ordem de tabulação
		// se estiver abrindo do estado recolhido, remova o cabeçalho anterior da ordem de tabulação
		// se estivermos colapsando, mantenha o cabeçalho de recolhimento na ordem de tabulação
		if (toShow.length && toHide.length) {
			toHide.prev (). attr ({
				"tabIndex": -1,
				"aria-expandido": "falso"
			});
		} else if (toShow.length) {
			this.headers.filter (function () {
				return parseInt ($ (this) .attr ("tabIndex"), 10) === 0;
			})
				.attr ("tabIndex", -1);
		}

		mostrar
			.attr ("aria-hidden", "false")
			.prev ()
				.attr ({
					"aria-selected": "true",
					"aria-expandido": "true",
					tabIndex: 0
				});
	}

	_animate: function (toShow, toHide, data) {
		var total, facilitação, duração,
			isso = isto
			ajustar = 0,
			boxSizing = toShow.css ("box-sizing"),
			down = toShow.length &&
				(! toHide.length || (toShow.index () <toHide.index ())),
			animate = this.options.animate || {}
			opções = down && animate.down || animar,
			complete = function () {
				that._toggleComplete (dados);
			};

		if (opções typeof === "number") {
			duração = opções;
		}
		if (opções typeof === "string") {
			easing = opções;
		}

		// recua de opções para animação no caso de configurações parciais para baixo
		facilitando = facilitando || options.easing || animate.easing;
		duração = duração || options.duration || animate.duration;

		if (! toHide.length) {
			return toShow.animate (this.showProps, duração, atenuação, completa);
		}
		if (! toShow.length) {
			return toHide.animate (this.hideProps, duração, atenuação, completa);
		}

		total = toShow.show (). outerHeight ();
		toHide.animate (this.hideProps, {
			duração: duração,
			facilitando: facilitando,
			step: function (agora, fx) {
				fx.now = Math.round (agora);
			}
		});
		mostrar
			.ocultar()
			.animate (this.showProps, {
				duração: duração,
				facilitando: facilitando,
				completo: completo
				step: function (agora, fx) {
					fx.now = Math.round (agora);
					if (fx.prop! == "altura") {
						if (boxSizing === "content-box") {
							ajustar + = fx.now;
						}
					} else if (that.options.heightStyle! == "conteúdo") {
						fx.now = Math.round (total - toHide.outerHeight () - ajustar);
						ajustar = 0;
					}
				}
			});
	}

	_toggleComplete: function (data) {
		var toHide = data.oldPanel,
			prev = toHide.prev ();

		this._removeClass (toHide, "ui-accordion-content-active");
		this._removeClass (prev, "ui-accordion-header-active")
			._addClass (prev, "ui-accordion-header-collapsed");

		// Contornar para renderizar bug no IE (# 5421)
		if (toHide.length) {
			toHide.parent () [0] .className = toHide.parent () [0] .className;
		}
		this._trigger ("ativar", nulo, dados);
	}
});



var safeActiveElement = $ .ui.safeActiveElement = function (document) {
	var activeElement;

	// Suporte: apenas no IE 9
	// IE9 lança um "Erro não especificado" acessando document.activeElement de um <iframe>
	experimentar {
		activeElement = document.activeElement;
	} pegar (erro) {
		activeElement = document.body;
	}

	// Suporte: IE 9 - 11 apenas
	// IE pode retornar null em vez de um elemento
	// Curiosamente, isso só parece ocorrer quando NÃO está em um iframe
	if (! activeElement) {
		activeElement = document.body;
	}

	// Suporte: apenas no IE 11
	// IE11 retorna um objeto aparentemente vazio em alguns casos ao acessar
	// document.activeElement de um <iframe>
	if (! activeElement.nodeName) {
		activeElement = document.body;
	}

	return activeElement;
};


/ *!
 * jQuery UI Menu 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Menu
// >> group: Widgets
// >> description: Cria menus aninhados.
// >> docs: http://api.jqueryui.com/menu/
// >> demos: http://jqueryui.com/menu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/menu.css
//>>css.theme: ../../themes/base/theme.css



var widgetsMenu = $ .widget ("ui.menu", {
	versão: "1.12.1",
	defaultElement: "<ul>",
	atraso: 300,
	opções: {
		ícones: {
			submenu: "ui-icon-caret-1-e"
		}
		itens: "> *",
		menus: "ul",
		position: {
			meu: "top esquerdo",
			em: "topo direito"
		}
		papel: "menu",

		// Callbacks
		borrão: null,
		foco: null,
		selecione: null
	}

	_create: function () {
		this.activeMenu = this.element;

		// Sinalizador usado para impedir o acionamento do manipulador de cliques
		// conforme o evento passa por cima dos menus aninhados
		this.mouseHandled = false;
		this.element
			.ID único()
			.attr ({
				role: this.options.role,
				tabIndex: 0
			});

		this._addClass ("ui-menu", "ui-widget ui-widget-content");
		this._on ({

			// Impedir que o foco fique preso a links dentro do menu depois de clicar
			// eles (o foco deve ficar sempre na UL durante a navegação).
			"mousedown .ui-menu-item": function (event) {
				event.preventDefault ();
			}
			"click .ui-menu-item": function (event) {
				var target = $ (event.target);
				var active = $ ($ .ui.safeActiveElement (this.document [0]));
				if (! this.mouseHandled && target.not (".-estado-desativado") .length) {
					this.select (evento);

					// Somente configure o flag mouseHandled se o evento estiver em bolhas, veja # 9469.
					if (! event.isPropagationStopped ()) {
						this.mouseHandled = true;
					}

					// Abrir submenu ao clicar
					if (target.has (".ui-menu") .comprimento) {
						this.expand (evento);
					} else if (! this.element.is (": focus") &&
							activ e.closest (".ui-menu") .comprimento) {

						// Redirecionar foco para o menu
						this.element.trigger ("foco", [verdadeiro]);

						// Se o item ativo estiver no nível superior, deixe-o permanecer ativo.
						// Caso contrário, desfoque o item ativo, já que ele não está mais visível.
						if (this.active && this.active.parents (".ui-menu") .length === 1) {
							clearTimeout (this.timer);
						}
					}
				}
			}
			"mouse .ui-menu-item": function (event) {

				// Ignore os eventos do mouse enquanto o typeahead estiver ativo, veja # 10458.
				// Impede a focagem do item errado quando typeahead causa uma rolagem enquanto o mouse
				// está sobre um item no menu
				if (this.previousFilter) {
					Retorna;
				}

				var actualTarget = $ (event.target) .closest (".ui-menu-item"),
					target = $ (event.currentTarget);

				// Ignore eventos com bolhas nos itens pais, veja # 11641
				if (actualTarget [0]! == target [0]) {
					Retorna;
				}

				// Remover a classe ui-state-active dos irmãos do item de menu recém-focalizado
				// para evitar um salto causado por elementos adjacentes, ambos tendo uma classe com uma borda
				this._removeClass (target.siblings (). children (". estado-estado-ativo"),
					null, "ui-state-active");
				this.focus (evento, alvo);
			}
			mouseleave: "colapsoTudo",
			"mouseleave .ui-menu": "colapsoTudo",
			focus: function (event, keepActiveItem) {

				// Se já houver um item ativo, mantenha-o ativo
				// Se não, ative o primeiro item
				var item = this.active || this.element.find (this.options.items) .eq (0);

				if (! keepActiveItem) {
					this.focus (evento, item);
				}
			}
			blur: function (event) {
				this._delay (function () {
					var notContained =! $. contém (
						this.element [0],
						$ .ui.safeActiveElement (this.document [0])
					);
					if (notContained) {
						this.collapseAll (evento);
					}
				});
			}
			keydown: "_keydown"
		});

		this.refresh ();

		// Cliques fora de um menu recolher qualquer menu aberto
		this._on (this.document, {
			click: function (event) {
				if (this._closeOnDocumentClick (event)) {
					this.collapseAll (evento);
				}

				// Redefinir o sinalizador mouseHandled
				this.mouseHandled = false;
			}
		});
	}

	_destroy: function () {
		var items = this.element.find (". -ui-menu-item")
				.removeAttr ("role aria-disabled"),
			submenus = items.children (".ui-menu-item-wrapper")
				.removeUniqueId ()
				.removeAttr ("tabIndex role aria-haspopup");

		// Destrói (sub) menus
		this.element
			.removeAttr ("aria-activedescendant")
			.find (".ui-menu") .addBack ()
				.removeAttr ("role aria-labelledby aria-expandido aria-hidden aria-disabled" +
					"tabIndex")
				.removeUniqueId ()
				.exposição();

		submenus.children (). each (function () {
			var elem = $ (this);
			if (elem.data ("menu-ui-submenu-careta")) {
				elem.remove ();
			}
		});
	}

	_keydown: function (event) {
		fósforo do var, prévio, caráter, salto,
			preventDefault = true;

		switch (event.keyCode) {
		case $ .ui.keyCode.PAGE_UP:
			this.previousPage (event);
			quebrar;
		case $ .ui.keyCode.PAGE_DOWN:
			this.nextPage (evento);
			quebrar;
		case $ .ui.keyCode.HOME:
			this._move ("primeiro", "primeiro", evento);
			quebrar;
		case $ .ui.keyCode.END:
			this._move ("last", "last", event);
			quebrar;
		case $ .ui.keyCode.UP:
			this.previous (evento);
			quebrar;
		case $ .ui.keyCode.DOWN:
			this.next (evento);
			quebrar;
		case $ .ui.keyCode.LEFT:
			this.collapse (evento);
			quebrar;
		case $ .ui.keyCode.RIGHT:
			if (this.active &&! this.active.is (". estado-desativado")) {
				this.expand (evento);
			}
			quebrar;
		case $ .ui.keyCode.ENTER:
		case $ .ui.keyCode.SPACE:
			this._activate (evento);
			quebrar;
		case $ .ui.keyCode.ESCAPE:
			this.collapse (evento);
			quebrar;
		padrão:
			preventDefault = false;
			prev = this.previousFilter || "";
			skip = false;

			// Suporta valores do teclado numérico
			character = event.keyCode> = 96 && event.keyCode <= 105?
				(event.keyCode - 96) .toString (): String.fromCharCode (event.keyCode);

			clearTimeout (this.filterTimer);

			if (personagem === prev) {
				skip = true;
			} outro {
				caractere = prev + caractere;
			}

			match = this._filterMenuItems (caractere);
			match = skip && match.index (this.active.next ())! == -1?
				this.active.nextAll ("item do menu -ui"):
				Combine;

			// Se não houver correspondências no filtro atual, redefina para o último caractere pressionado
			// para descer o menu para o primeiro item que começa com esse caractere
			if (! match.length) {
				character = String.fromCharCode (event.keyCode);
				match = this._filterMenuItems (caractere);
			}

			if (match.length) {
				this.focus (evento, jogo);
				this.previousFilter = caractere;
				this.filterTimer = this._delay (function () {
					delete this.previousFilter;
				}, 1000);
			} outro {
				delete this.previousFilter;
			}
		}

		if (preventDefault) {
			event.preventDefault ();
		}
	}

	_activate: function (event) {
		if (this.active &&! this.active.is (". estado-desativado")) {
			if (this.active.children ("[aria-haspopup = 'true']") .comprimento) {
				this.expand (evento);
			} outro {
				this.select (evento);
			}
		}
	}

	refresh: function () {
		var menus, itens, newSubmenus, newItems, newWrappers,
			isso = isto
			icon = this.options.icons.submenu,
			submenus = this.element.find (this.options.menus);

		this._toggleClass ("ui-menu-icons", nulo, !! this.element.find ("ícone -ui") .length);

		// Inicializa menus aninhados
		newSubmenus = submenus.filter (": not (.ui-menu)")
			.ocultar()
			.attr ({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expandido": "falso"
			})
			.each (function () {
				menu var = $ (this),
					item = menu.prev (),
					submenuCaret = $ ("<span>") .data ("ui-menu-submenu-caret", true);

				that._addClass (submenuCaret, "ui-menu-icon", "ícone-ui" + ícone);
				item
					.attr ("aria-haspopup", "true")
					.prepend (submenuCaret);
				menu.attr ("aria-labelledby", item.attr ("id"));
			});

		this._addClass (newSubmenus, "ui-menu", "ui-widget ui-widget-conteúdo ui-front");

		menus = submenus.add (this.element);
		items = menus.find (this.options.items);

		// Inicializa itens de menu contendo espaços e / ou travessões apenas como divisores
		items.not (". -menu-menu-item") .each (function () {
			var item = $ (this);
			if (that._isDivider (item)) {
				that._addClass (item, "ui-menu-divider", "ui-widget-content");
			}
		});

		// Não atualiza itens de lista que já estão adaptados
		newItems = items.not ("item de menu -ui, divisor de menu -ui");
		newWrappers = newItems.children ()
			.not (".ui-menu")
				.ID único()
				.attr ({
					tabIndex: -1,
					role: this._itemRole ()
				});
		this._addClass (newItems, "ui-menu-item")
			._addClass (newWrappers, "ui-menu-item-wrapper");

		// Adicionar um atributo aria-disabled a qualquer item de menu desativado
		items.filter (".-state-disabled") .attr ("aria-disabled", "true");

		// Se o item ativo foi removido, desfoque o menu
		if (this.active &&! $. contains (this.element [0], this.active [0])) {
			this.blur ();
		}
	}

	_itemRole: function () {
		Retorna {
			menu: "menuitem",
			listbox: "opção"
		} [this.options.role];
	}

	_setOption: function (key, value) {
		if (chave === "ícones") {
			var icons = this.element.find ("ícone do menu-i");
			this._removeClass (ícones, null, this.options.icons.submenu)
				._addClass (ícones, null, valor.submenu);
		}
		this._super (chave, valor);
	}

	_setOptionDisabled: function (value) {
		this._super (valor);

		this.element.attr ("aria-disabled", String (valor));
		this._toggleClass (null, "ui-state-disabled", valor !!);
	}

	foco: função (evento, item) {
		var aninhado, focado, ativoParente;
		this.blur (event, event && event.type === "foco");

		this._scrollIntoView (item);

		this.active = item.first ();

		focalizado = this.active.children (".ui-menu-item-wrapper");
		this._addClass (focado, nulo, "ui-state-active");

		// Somente atualiza o decrescente ativado por aria se houver um papel
		// caso contrário, assumimos que o foco é gerenciado em outro lugar
		if (this.options.role) {
			this.element.attr ("aria-activedescendant", focused.attr ("id"));
		}

		// Realce o item de menu pai ativo, se houver
		activeParent = this.active
			.parent ()
				.closest (".ui-menu-item")
					.children (".ui-menu-item-wrapper");
		this._addClass (activeParent, null, "ui-state-active");

		if (event && event.type === "keydown") {
			this._close ();
		} outro {
			this.timer = this._delay (function () {
				this._close ();
			}, this.delay);
		}

		nested = item.children (".ui-menu");
		if (nested.length && event && (/^mouse/.test (event.type)))) {
			this._startOpening (aninhado);
		}
		this.activeMenu = item.parent ();

		this._trigger ("focus", evento, {item: item});
	}

	_scrollIntoView: function (item) {
		var borderTop, paddingTop, deslocamento, rolagem, elementHeight, itemHeight;
		if (this._hasScroll ()) {
			borderTop = parseFloat ($ .css (this.activeMenu [0], "borderTopWidth")) || 0;
			paddingTop = parseFloat ($ .css (this.activeMenu [0], "paddingTop")) || 0;
			offset = item.offset () top - this.activeMenu.offset (). top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop ();
			elementHeight = this.activeMenu.height ();
			itemHeight = item.outerHeight ();

			if (deslocamento <0) {
				this.activeMenu.scrollTop (scroll + offset);
			} else if (deslocamento + itemHeight> elementHeight) {
				this.activeMenu.scrollTop (scroll + offset - elementHeight + itemHeight);
			}
		}
	}

	blur: function (event, fromFocus) {
		if (! fromFocus) {
			clearTimeout (this.timer);
		}

		if (! this.active) {
			Retorna;
		}

		this._removeClass (this.active.children (".ui-menu-item-wrapper"),
			null, "ui-state-active");

		this._trigger ("blur", evento, {item: this.active});
		this.active = nulo;
	}

	_startOpening: function (submenu) {
		clearTimeout (this.timer);

		// Não abra se já estiver aberto corrige um bug do Firefox que causou um pixel de .5
		// desloca a posição do submenu ao passar o mouse sobre o ícone do cursor
		if (submenu.attr ("aria-hidden")! == "true") {
			Retorna;
		}

		this.timer = this._delay (function () {
			this._close ();
			this._open (submenu);
		}, this.delay);
	}

	_open: function (submenu) {
		var position = $ .extend ({
			de: this.active
		}, this.options.position);

		clearTimeout (this.timer);
		this.element.find (".ui-menu") .not (submenu.parents ("menu -ui"))
			.ocultar()
			.attr ("aria-hidden", "true");

		submenu
			.exposição()
			.removeAttr ("aria-hidden")
			.attr ("aria-expanded", "true")
			posição (posição);
	}

	collapseAll: function (event, all) {
		clearTimeout (this.timer);
		this.timer = this._delay (function () {

			// Se tivermos passado um evento, procure o submenu que contém o evento
			var currentMenu = all? this.element:
				$ (event && event.target) .closest (this.element.find ("menu -ui"));

			// Se não encontrarmos um ancestral de submenu válido, use o menu principal para fechar
			// sub-menus de qualquer maneira
			if (! currentMenu.length) {
				currentMenu = this.element;
			}

			this._close (currentMenu);

			this.blur (evento);

			// Contornar item ativo permanecendo ativo após o menu ficar desfocado
			this._removeClass (currentMenu.find (".-estado-ativo"), null, "ui-state-active");

			this.activeMenu = currentMenu;
		}, this.delay);
	}

	// Sem argumentos, fecha o menu atualmente ativo - se nada estiver ativo
	// fecha todos os menus. Se passou um argumento, ele irá procurar por menus ABAIXO
	_close: function (startMenu) {
		if (! startMenu) {
			startMenu = this.active? this.active.parent (): this.element;
		}

		startMenu.find (".ui-menu")
			.ocultar()
			.attr ("aria-hidden", "true")
			.attr ("aria-expandido", "falso");
	}

	_closeOnDocumentClick: function (event) {
		return! $ (event.target) .closest (".ui-menu") .length;
	}

	_isDivider: function (item) {

		// Corresponder hífen, em traço, traço
		return! / [^ \ - \ u2014 \ u2013 \ s] /. test (item.text ());
	}

	colapso: função (evento) {
		var newItem = this.active &&
			this.active.parent (). mais próximo (". -menu-menu-item", this.element);
		if (newItem && newItem.length) {
			this._close ();
			this.focus (event, newItem);
		}
	}

	expand: function (event) {
		var newItem = this.active &&
			this.active
				.children (".ui-menu")
					.find (this.options.items)
						.primeiro();

		if (newItem && newItem.length) {
			this._open (newItem.parent ());

			// Atraso para que o Firefox não oculte a mudança ascendente ativada no submenu expansível de AT
			this._delay (function () {
				this.focus (event, newItem);
			});
		}
	}

	próximo: função (evento) {
		this._move ("next", "first", event);
	}

	previous: function (event) {
		this._move ("prev", "last", event);
	}

	isFirstItem: function () {
		return this.active &&! this.active.prevAll ("item-menu-ui"). comprimento;
	}

	isLastItem: function () {
		return this.active &&! this.active.nextAll ("item-menu-ui") .comprimento;
	}

	_move: função (direção, filtro, evento) {
		var next;
		if (this.active) {
			if (direction === "first" || direção === "last") {
				next = this.active
					[direção === "primeiro"? "prevAll": "nextAll"] ("item do menu -ui")
					eq (-1);
			} outro {
				next = this.active
					[direção + "Todos"] (".-item-menu-is")
					eq (0);
			}
		}
		if (! next ||! next.length ||! this.active) {
			next = this.activeMenu.find (this.options.items) [filtro] ();
		}

		this.focus (evento, próximo);
	}

	nextPage: function (event) {
		var item, base, altura;

		if (! this.active) {
			this.next (evento);
			Retorna;
		}
		if (this.isLastItem ()) {
			Retorna;
		}
		if (this._hasScroll ()) {
			base = this.active.offset (). top;
			height = this.element.height ();
			this.active.nextAll ("item do menu -ui") .each (function () {
				item = $ (isto);
				return item.offset () top-base-altura <0;
			});

			this.focus (evento, item);
		} outro {
			this.focus (evento, this.activeMenu.find (this.options.items)
				[! this.active? "primeiro último" ]() );
		}
	}

	previousPage: function (event) {
		var item, base, altura;
		if (! this.active) {
			this.next (evento);
			Retorna;
		}
		if (this.isFirstItem ()) {
			Retorna;
		}
		if (this._hasScroll ()) {
			base = this.active.offset (). top;
			height = this.element.height ();
			this.active.prevAll (". -i-menu-item") .each (function () {
				item = $ (isto);
				return item.offset (). top - base + altura> 0;
			});

			this.focus (evento, item);
		} outro {
			this.focus (event, this.activeMenu.find (this.options.items) .first ());
		}
	}

	_hasScroll: function () {
		return this.element.outerHeight () <this.element.prop ("scrollHeight");
	}

	select: function (event) {

		// TODO: Nunca deve ser possível não ter um item ativo neste
		// aponta, mas os testes não ativam o mouseenter antes de clicar.
		this.active = this.active || $ (event.target) .closest (".ui-menu-item");
		var ui = {item: this.active};
		if (! this.active.has ("menu -ui") .comprimento) {
			this.collapseAll (evento, verdadeiro);
		}
		this._trigger ("select", evento, ui);
	}

	_filterMenuItems: function (character) {
		var escapedCharacter = character.replace (/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\ $ &"),
			regex = new RegExp ("^" + escapedCharacter, "i");

		return this.activeMenu
			.find (this.options.items)

				// Corresponder somente em itens, não em divisores ou outro conteúdo (# 10571)
				.filter ("item-menu-ui")
					.filter (function () {
						return regex.test (
							$ .trim ($ (this) .children (". -uu-menu-item-wrapper") .text ()));
					});
	}
});


/ *!
 * Autocomplete da UI do jQuery 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Autocomplete
// >> group: Widgets
// >> description: Lista palavras sugeridas conforme o usuário está digitando.
// >> docs: http://api.jqueryui.com/autocomplete/
// >> demos: http://jqueryui.com/autocomplete/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/autocomplete.css
//>>css.theme: ../../themes/base/theme.css



$ .widget ("ui.autocomplete", {
	versão: "1.12.1",
	defaultElement: "<input>",
	opções: {
		appendTo: null,
		autoFocus: false,
		atraso: 300,
		minLength: 1,
		position: {
			meu: "top esquerdo",
			em: "fundo esquerdo",
			colisão: "nenhum"
		}
		fonte: null,

		// Callbacks
		mudança: null,
		close: null,
		foco: null,
		aberto: null,
		resposta: null,
		pesquisa: null,
		selecione: null
	}

	requestIndex: 0,
	pendente: 0,

	_create: function () {

		// Alguns navegadores só repetem eventos keydown, não pressionam os eventos,
		// então usamos o sinalizador suppressKeyPress para determinar se já
		// lidou com o evento keydown. # 7269
		// Infelizmente, o código para & in keypress é o mesmo que a seta para cima,
		// então usamos o sinalizador suppressKeyPressRepeat para evitar manipular o pressionamento de tecla
		// eventos quando sabemos que o evento keydown foi usado para modificar o
		// termo de pesquisa. # 7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element [0] .nodeName.toLowerCase (),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "entrada";

		// Textareas são sempre multi-linha
		// As entradas são sempre de linha única, mesmo se dentro de um elemento contentEditable
		// IE também trata as entradas como contentEditable
		// Todos os outros tipos de elementos são determinados pelo fato de serem ou não contentes
		this.isMultiLine = isTextarea || ! isInput && this._isContentEditable (this.element);

		this.valueMethod = this.element [isTextarea || isInput? "val": "texto"];
		this.isNewMenu = true;

		this._addClass ("ui-autocomplete-input");
		this.element.attr ("autocomplete", "off");

		this._on (this.element, {
			keydown: function (event) {
				if (this.element.prop ("readOnly")) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					Retorna;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $ .ui.keyCode;
				switch (event.keyCode) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move ("previousPage", evento);
					quebrar;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move ("nextPage", evento);
					quebrar;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent ("anterior", evento);
					quebrar;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent ("next", evento);
					quebrar;
				case keyCode.ENTER:

					// quando o menu está aberto e tem foco
					if (this.menu.active) {

						// # 6055 - O Opera ainda permite que o pressionamento de tecla ocorra
						// que faz com que os formulários sejam enviados
						suppressKeyPress = true;
						event.preventDefault ();
						this.menu.select (evento);
					}
					quebrar;
				case keyCode.TAB:
					if (this.menu.active) {
						this.menu.select (evento);
					}
					quebrar;
				case keyCode.ESCAPE:
					if (this.menu.element.is (": visible")) {
						if (! this.isMultiLine) {
							this._value (this.term);
						}
						this.close (evento);

						// Navegadores diferentes têm comportamento padrão diferente para escape
						// A imprensa simples pode significar desfazer ou limpar
						// Pressione duas vezes no IE significa limpar todo o formulário
						event.preventDefault ();
					}
					quebrar;
				padrão:
					suppressKeyPressRepeat = true;

					// timeout da pesquisa deve ser acionado antes que o valor de entrada seja alterado
					this._searchTimeout (evento);
					quebrar;
				}
			}
			keypress: function (event) {
				if (suppressKeyPress) {
					suppressKeyPress = false;
					if (! this.isMultiLine || this.menu.element.is (": visible")) {
						event.preventDefault ();
					}
					Retorna;
				}
				if (suppressKeyPressRepeat) {
					Retorna;
				}

				// Replicar alguns manipuladores chave para permitir que eles se repitam no Firefox e no Opera
				var keyCode = $ .ui.keyCode;
				switch (event.keyCode) {
				case keyCode.PAGE_UP:
					this._move ("previousPage", evento);
					quebrar;
				case keyCode.PAGE_DOWN:
					this._move ("nextPage", evento);
					quebrar;
				case keyCode.UP:
					this._keyEvent ("anterior", evento);
					quebrar;
				case keyCode.DOWN:
					this._keyEvent ("next", evento);
					quebrar;
				}
			}
			input: function (event) {
				if (suppressInput) {
					suppressInput = false;
					event.preventDefault ();
					Retorna;
				}
				this._searchTimeout (evento);
			}
			focus: function () {
				this.selectedItem = null;
				this.previous = this._value ();
			}
			blur: function (event) {
				if (this.cancelBlur) {
					delete this.cancelBlur;
					Retorna;
				}

				clearTimeout (this.searching);
				this.close (evento);
				this._change (evento);
			}
		});

		this._initSource ();
		this.menu = $ ("<ul>")
			.appendTo (this._appendTo ())
			.cardápio( {

				// desativa o suporte ARIA, a região viva cuida disso
				papel: null
			})
			.ocultar()
			.menu ("instance");

		this._addClass (this.menu.element, "ui-autocomplete", "ui-front");
		this._on (this.menu.element, {
			mousedown: function (event) {

				// impede o foco móvel fora do campo de texto
				event.preventDefault ();

				// O IE não impede o foco em movimento, mesmo com event.preventDefault ()
				// então definimos um sinalizador para saber quando devemos ignorar o evento de desfoque
				this.cancelBlur = true;
				this._delay (function () {
					delete this.cancelBlur;

					// Suporte: somente no IE 8
					// Clique com o botão direito do mouse em um item de menu ou selecione o texto dos itens do menu.
					// resultar no foco saindo da entrada. No entanto, já recebemos
					// e ignorou o evento blur por causa do sinalizador cancelBlur definido acima. assim
					// restauramos o foco para garantir que o menu seja fechado corretamente com base no usuário
					// próximas ações.
					if (this.element [0]! == $ .ui.safeActiveElement (this.document [0])) {
						this.element.trigger ("focus");
					}
				});
			}
			menufocus: function (event, ui) {
				var label, item;

				// suporte: Firefox
				// Impede a ativação acidental de itens de menu no Firefox (# 7024 # 9118)
				if (this.isNewMenu) {
					this.isNewMenu = false;
					if (event.originalEvent && /^mouse/.test (event.originalEvent.type)) {
						this.menu.blur ();

						this.document.one ("mousemove", function () {
							$ (event.target) .trigger (event.originalEvent);
						});

						Retorna;
					}
				}

				item = ui.item.data ("ui-autocomplete-item");
				if (false! == this._trigger ("focus", evento, {item: item})) {

					// use o valor para corresponder ao que terminará na entrada, se for um evento chave
					if (event.originalEvent && /^key/.test (event.originalEvent.type)) {
						this._value (item.value);
					}
				}

				// Anuncia o valor no liveRegion
				label = ui.item.attr ("aria-label") || valor do item;
				if (label && $ .trim (label) .length) {
					this.liveRegion.children (). hide ();
					$ ("<div>") .text (label) .appendTo (this.liveRegion);
				}
			}
			menuselect: function (event, ui) {
				var item = ui.item.data ("ui-autocomplete-item"),
					previous = this.previous;

				// Acione somente quando o foco foi perdido (clique no menu)
				if (this.element [0]! == $ .ui.safeActiveElement (this.document [0])) {
					this.element.trigger ("focus");
					this.previous = anterior;

					// # 6109 - IE aciona dois eventos de foco e o segundo
					// é assíncrono, então precisamos redefinir o anterior
					// termo de forma síncrona e assíncrona :-(
					this._delay (function () {
						this.previous = anterior;
						this.selectedItem = item;
					});
				}

				if (false! == this._trigger ("selecionar", evento, {item: item})) {
					this._value (item.value);
				}

				// redefina o termo após o evento select
				// isso permite que a manipulação de seleção personalizada funcione corretamente
				this.term = this._value ();

				this.close (evento);
				this.selectedItem = item;
			}
		});

		this.liveRegion = $ ("<div>", {
			papel: "status",
			"aria-live": "assertivo",
			"relevante para a ária": "adições"
		})
			.appendTo (this.document [0] .body);

		this._addClass (this.liveRegion, null, "ui-helper-hidden-acessível");

		// Desativar o preenchimento automático impede que o navegador se lembre do
		// valor ao navegar pelo histórico, por isso reativamos o preenchimento automático
		// se a página for descarregada antes que o widget seja destruído. # 7790
		this._on (this.window, {
			beforeunload: function () {
				this.element.removeAttr ("autocomplete");
			}
		});
	}

	_destroy: function () {
		clearTimeout (this.searching);
		this.element.removeAttr ("autocomplete");
		this.menu.element.remove ();
		this.liveRegion.remove ();
	}

	_setOption: function (key, value) {
		this._super (chave, valor);
		if (chave === "fonte") {
			this._initSource ();
		}
		if (chave === "appendTo") {
			this.menu.element.appendTo (this._appendTo ());
		}
		if (key === "disabled" && value && this.xhr) {
			this.xhr.abort ();
		}
	}

	_isEventTargetInWidget: function (event) {
		var menuElement = this.menu.element [0];

		return event.target === this.element [0] ||
			event.target === menuElement ||
			$ .contains (menuElement, event.target);
	}

	_closeOnClickOutside: function (event) {
		if (! this._isEventTargetInWidget (event)) {
			this.close ();
		}
	}

	_appendTo: function () {
		var element = this.options.appendTo;

		if (element) {
			element = element.jquery || element.nodeType?
				$ (elemento):
				this.document.find (element) .eq (0);
		}

		if (! elemento ||! elemento [0]) {
			element = this.element.closest (".ui-front, dialog");
		}

		if (! element.length) {
			element = this.document [0] .body;
		}

		elemento de retorno;
	}

	_initSource: function () {
		var array, url,
			isso = isto;
		if ($ .isArray (this.options.source)) {
			array = this.options.source;
			this.source = function (request, response) {
				resposta ($ .ui.autocomplete.filter (array, request.term));
			};
		} else if (typeof this.options.source === "string") {
			url = this.options.source;
			this.source = function (request, response) {
				if (that.xhr) {
					that.xhr.abort ();
				}
				that.xhr = $ .ajax ({
					url: url,
					pedido de data,
					dataType: "json",
					success: function (data) {
						resposta (dados);
					}
					erro: function () {
						resposta( [] );
					}
				});
			};
		} outro {
			this.source = this.options.source;
		}
	}

	_searchTimeout: function (event) {
		clearTimeout (this.searching);
		this.searching = this._delay (function () {

			// Procura se o valor mudou, ou se o usuário re-escreve o mesmo valor (veja # 7434)
			var equalValues ​​= this.term === this._value (),
				menuVisible = this.menu.element.is (": visible"),
				modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

			if (! equalValues ​​|| (equalValues ​​&&! menuVisible &&! modifierKey)) {
				this.selectedItem = null;
				this.search (null, evento);
			}
		}, this.options.delay);
	}

	pesquisa: function (valor, evento) {
		valor = valor! = nulo? valor: this._value ();

		// Sempre salve o valor real, não aquele passado como argumento
		this.term = this._value ();

		if (value.length <this.options.minLength) {
			return this.close (evento);
		}

		if (this._trigger ("pesquisa", evento) === false) {
			Retorna;
		}

		retorne this._search (valor);
	}

	_search: function (value) {
		this.pending ++;
		this._addClass ("ui-autocomplete-loading");
		this.cancelSearch = false;

		this.source ({term: value}, this._response ());
	}

	_response: function () {
		var index = ++ this.requestIndex;

		return $ .proxy (function (content) {
			if (index === this.requestIndex) {
				esta .__ resposta (conteúdo);
			}

			this.pending--;
			if (! this.pending) {
				this._removeClass ("ui-autocomplete-loading");
			}
		}, este );
	}

	__response: function (content) {
		if (content) {
			content = this._normalize (content);
		}
		this._trigger ("response", null, {content: content});
		if (! this.options.disabled && content && content.length &&! this.cancelSearch) {
			this._suggest (conteúdo);
			this._trigger ("open");
		} outro {

			// use ._close () em vez de .close () para não cancelar pesquisas futuras
			this._close ();
		}
	}

	close: function (event) {
		this.cancelSearch = true;
		this._close (evento);
	}

	_close: function (event) {

		// Remover o manipulador que fecha o menu em cliques externos
		this._off (this.document, "mousedown");

		if (this.menu.element.is (": visible")) {
			this.menu.element.hide ();
			this.menu.blur ();
			this.isNewMenu = true;
			this._trigger ("fechar", evento);
		}
	}

	_change: function (event) {
		if (this.previous! == this._value ()) {
			this._trigger ("change", evento, {item: this.selectedItem});
		}
	}

	_normalize: function (items) {

		// assume que todos os itens têm o formato correto quando o primeiro item está completo
		if (items.length && items [0] .label && itens [0] .valor) {
			itens de retorno;
		}
		return $ .map (itens, função (item) {
			if (tipo de item === "string") {
				Retorna {
					label: item,
					valor: item
				};
			}
			return $ .extend ({}, item, {
				label: item.label || valor do item,
				valor: item.value || item.label
			});
		});
	}

	_suggest: function (items) {
		var ul = this.menu.element.empty ();
		this._renderMenu (ul, itens);
		this.isNewMenu = true;
		this.menu.refresh ();

		// Menu de tamanho e posição
		ul.show ();
		this._resizeMenu ();
		ul.position ($ .extend ({
			de: this.element
		}, this.options.position));

		if (this.options.autoFocus) {
			this.menu.next ();
		}

		// Ouça as interações fora do widget (# 6642)
		this._on (this.document, {
			mousedown: "_closeOnClickOutside"
		});
	}

	_resizeMenu: function () {
		var ul = este.menu.element;
		ul.outerWidth (Math.max (

			// O Firefox envolve texto longo (possivelmente um erro de arredondamento)
			// então adicionamos 1px para evitar a quebra (# 7513)
			ul.width ("") .outerWidth () + 1,
			this.element.outerWidth ()
		));
	}

	_renderMenu: function (ul, items) {
		var isso = isto;
		$ .each (itens, função (índice, item) {
			that._renderItemData (ul, item);
		});
	}

	_renderItemData: function (ul, item) {
		return this._renderItem (ul, item) .data ("ui-autocomplete-item", item);
	}

	_renderItem: function (ul, item) {
		return $ ("<li>")
			.append ($ ("<div>") .text (item.label))
			.appendTo (ul);
	}

	_move: function (direction, event) {
		if (! this.menu.element.is (": visible")) {
			this.search (null, evento);
			Retorna;
		}
		if (this.menu.isFirstItem () && /^previous/.test (direção) ||
				this.menu.isLastItem () && /^next/.test (direction)) {

			if (! this.isMultiLine) {
				this._value (this.term);
			}

			this.menu.blur ();
			Retorna;
		}
		this.menu [direção] (evento);
	}

	widget: function () {
		retornar this.menu.element;
	}

	_value: function () {
		return this.valueMethod.apply (this.element, arguments);
	}

	_keyEvent: function (keyEvent, event) {
		if (! this.isMultiLine || this.menu.element.is (": visible")) {
			this._move (keyEvent, event);

			// Impede que o cursor se mova para o início / fim do campo de texto em alguns navegadores
			event.preventDefault ();
		}
	}

	// Suporte: Chrome <= 50
	// Devemos ser capazes de usar apenas this.element.prop ("isContentEditable")
	// mas elementos ocultos sempre reportam falso no Chrome.
	// https://code.google.com/p/chromium/issues/detail?id=313082
	_isContentEditable: function (element) {
		if (! element.length) {
			retorna falso;
		}

		var editable = element.prop ("contentEditable");

		if (editável === "herdar") {
		  return this._isContentEditable (element.parent ());
		}

		return editable === "true";
	}
});

$ .extend ($ .ui.autocomplete, {
	escapeRegex: function (value) {
		return value.replace (/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\ $ &");
	}
	filter: function (array, termo) {
		var matcher = new RegExp ($ .ui.autocomplete.escapeRegex (termo), "i");
		return $ .grep (array, função (valor) {
			return matcher.test (value.label || value.value || valor);
		});
	}
});

// Extensão de região ativa, adicionando uma opção `messages`
// NOTA: esta é uma API experimental. Nós ainda estamos investigando
// uma solução completa para manipulação e internacionalização de strings.
$ .widget ("ui.autocomplete", $ .ui.autocomplete, {
	opções: {
		messages: {
			noResults: "Nenhum resultado de pesquisa",
			resultados: function (amount) {
				valor de retorno + (valor> 1? "resultados são": "resultado é") +
					"disponível, use as teclas de seta para cima e para baixo para navegar.";
			}
		}
	}

	__response: function (content) {
		var mensagem;
		this._superApply (argumentos);
		if (this.options.disabled || this.cancelSearch) {
			Retorna;
		}
		if (content && content.length) {
			message = this.options.messages.results (content.length);
		} outro {
			message = this.options.messages.noResults;
		}
		this.liveRegion.children (). hide ();
		$ ("<div>") .text (message) .appendTo (this.liveRegion);
	}
});

var widgetsAutocomplete = $ .ui.autocomplete;


/ *!
 jQuery UI Controlgroup 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Controlgroup
// >> group: Widgets
// >> description: Visualmente, os grupos formam widgets de controle
// >> docs: http://api.jqueryui.com/controlgroup/
// >> demos: http://jqueryui.com/controlgroup/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/controlgroup.css
//>>css.theme: ../../themes/base/theme.css


var controlgroupCornerRegex = / ui-corner - ([az]) {2,6} / g;

var widgetsControlgroup = $ .widget ("ui.controlgroup", {
	versão: "1.12.1",
	defaultElement: "<div>",
	opções: {
		direção: "horizontal",
		desativado: nulo
		onlyVisible: true
		Unid: {
			"botão": "input [type = button], entrada [type = submit], entrada [type = reset], botão, a",
			"controlgroupLabel": ".ui-controlgroup-label",
			"checkboxradio": "input [type = 'checkbox'], entrada [type = 'radio']",
			"selectmenu": "select",
			"spinner": ".ui-spinner-input"
		}
	}

	_create: function () {
		this._enhance ();
	}

	// Para suportar a opção aprimorada no jQuery Mobile, isolamos a manipulação do DOM
	_enhance: function () {
		this.element.attr ("papel", "barra de ferramentas");
		this.refresh ();
	}

	_destroy: function () {
		this._callChildMethod ("destroy");
		this.childWidgets.removeData ("ui-controlgroup-data");
		this.element.removeAttr ("role");
		if (this.options.items.controlgroupLabel) {
			this.element
				.find (this.options.items.controlgroupLabel)
				.find (".ui-controlgroup-label-contents")
				.contents (). unwrap ();
		}
	}

	_initWidgets: function () {
		var isso = isso,
			childWidgets = [];

		// Primeiro nós iteramos sobre cada uma das opções de itens
		$ .each (this.options.items, função (widget, seletor) {
			var etiquetas;
			var options = {};

			// Verifique se o widget tem um conjunto de seletores
			if (! selector) {
				Retorna;
			}

			if (widget === "controlgroupLabel") {
				labels = that.element.find (seletor);
				labels.each (function () {
					var element = $ (this);

					if (element.children (". control-control-label-contents") .comprimento) {
						Retorna;
					}
					element.contents ()
						.wrapAll ("<span class = 'ui-controlgroup-label-contents'> </ span>");
				});
				that._addClass (rótulos, null, "ui-widget ui-widget-conteúdo ui-estado-padrão");
				childWidgets = childWidgets.concat (labels.get ());
				Retorna;
			}

			// Verifique se o widget realmente existe
			if (! $. fn [widget]) {
				Retorna;
			}

			// Nós assumimos que tudo está no meio para começar porque não podemos determinar
			// first / last elements até que todos os aprimoramentos sejam feitos.
			if (that ["_" + widget + "Opções"]) {
				options = that ["_" + widget + "Opções"] ("meio");
			} outro {
				opções = {classes: {}};
			}

			// Encontrar instâncias deste widget dentro do controlgroup e iniciá-las
			that.element
				.find (seletor)
				.each (function () {
					var element = $ (this);
					var instance = elemento [widget] ("instância");

					// Precisamos clonar as opções padrão para esse tipo de widget para evitar
					// poluindo as opções de variáveis ​​que tem um escopo mais amplo do que um único widget.
					var instanceOptions = $ .widget.extend ({}, opções);

					// Se o botão for filho de um spinner, ignore-o
					// TODO: Encontre uma solução mais genérica
					if (widget === "botão" && element.parent (".ui-spinner") .comprimento) {
						Retorna;
					}

					// Cria o widget se ele não existir
					if (! instance) {
						instance = element [widget] () [widget] ("instância");
					}
					if (instance) {
						instanceOptions.classes =
							that._resolveClassesValues ​​(instanceOptions.classes, instance);
					}
					elemento [widget] (instanceOptions);

					// Armazena uma instância do controlgroup para poder fazer referência
					// do elemento mais externo para alterar opções e atualizar
					var widgetElement = elemento [widget] ("widget");
					$ .data (widgetElement [0], "ui-controlgroup-data",
						instância ? instance: elemento [widget] ("instância"));

					childWidgets.push (widgetElement [0]);
				});
		});

		this.childWidgets = $ ($ .unique (childWidgets));
		this._addClass (this.childWidgets, "ui-controlgroup-item");
	}

	_callChildMethod: function (method) {
		this.childWidgets.each (function () {
			var element = $ (this),
				data = element.data ("ui-controlgroup-data");
			if (data && data [método]) {
				dados [método] ();
			}
		});
	}

	_updateCornerClass: function (element, position) {
		var remove = "ui-canto-topo ui-canto-fundo ui-canto-esquerdo ui-canto-direito ui-canto-tudo";
		var add = this._buildSimpleOptions (posição, "label") .classes.label;

		this._removeClass (element, null, remove);
		this._addClass (element, null, add);
	}

	_buildSimpleOptions: function (position, key) {
		direção var = this.options.direction === "vertical";
		var result = {
			classes: {}
		};
		result.classes [key] = {
			"meio": "",
			"first": "ui-corner-" + (direção? "top": "esquerda"),
			"last": "ui-corner-" + (direção? "bottom": "right"),
			"somente": "ui-corner-all"
		} [posição];

		resultado de retorno;
	}

	_spinnerOptions: function (position) {
		var options = this._buildSimpleOptions (posição, "ui-spinner");

		options.classes ["ui-spinner-up"] = "";
		options.classes ["ui-spinner-down"] = "";

		opções de retorno;
	}

	_buttonOptions: function (position) {
		return this._buildSimpleOptions (posição, "botão-ui");
	}

	_checkboxradioOptions: function (position) {
		return this._buildSimpleOptions (position, "ui-checkboxradio-label");
	}

	_selectmenuOptions: function (position) {
		direção var = this.options.direction === "vertical";
		Retorna {
			largura: direção? "auto": falso,
			classes: {
				meio: {
					"ui-selectmenu-button-open": "",
					"ui-selectmenu-button-closed": ""
				}
				primeiro: {
					"ui-selectmenu-button-open": "ui-canto-" + (direção? "topo": "tl"),
					"ui-selectmenu-button-closed": "ui-corner-" + (direção? "top": "esquerda")
				}
				último: {
					"ui-selectmenu-button-open": direção? "": "ui-corner-tr",
					"ui-selectmenu-button-closed": "ui-canto-" + (direção? "parte inferior": "direita")
				}
				só: {
					"ui-selectmenu-button-open": "ui-canto-top",
					"ui-selectmenu-button-closed": "ui-canto-tudo"
				}

			} [posição]
		};
	}

	_resolveClassesValues: function (classes, instance) {
		var result = {};
		$ .each (classes, função (chave) {
			var current = instance.options.classes [chave] || "";
			current = $ .trim (current.replace (controlgroupCornerRegex, ""));
			result [key] = (atual + "" + classes [chave]) .replace (/ \ s + / g, "");
		});
		resultado de retorno;
	}

	_setOption: function (key, value) {
		if (chave === "direção") {
			this._removeClass ("ui-controlgroup-" + this.options.direction);
		}

		this._super (chave, valor);
		if (chave === "desativado") {
			this._callChildMethod (valor? "desativar": "ativar");
			Retorna;
		}

		this.refresh ();
	}

	refresh: function () {
		var crianças
			isso = isto;

		this._addClass ("ui-grupo de controle ui-controlgroup-" + this.options.direction);

		if (this.options.direction === "horizontal") {
			this._addClass (null, "ui-helper-clearfix");
		}
		this._initWidgets ();

		children = this.childWidgets;

		// Filtramos aqui porque precisamos rastrear todos os childWidgets, não apenas os visíveis
		if (this.options.onlyVisible) {
			children = children.filter (": visible");
		}

		if (children.length) {

			// Fazemos isso por último, porque precisamos garantir que todo aprimoramento seja feito
			// antes de determinar o primeiro e o último
			$ .each (["first", "last"], function (index, value) {
				var instance = children [valor] (). dados ("ui-controlgroup-data");

				if (instance && that ["_" + instance.widgetName + "Opções"]) {
					var options = that ["_" + instance.widgetName + "Opções"] (
						children.length === 1? "somente": valor
					);
					options.classes = that._resolveClassesValues ​​(options.classes, instance);
					instance.element [instance.widgetName] (opções);
				} outro {
					that._updateCornerClass (children [valor] (), valor);
				}
			});

			// Finalmente, chame o método de atualização em cada um dos widgets filhos.
			this._callChildMethod ("refresh");
		}
	}
});

/ *!
 * jQuery UI Checkboxradio 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Checkboxradio
// >> group: Widgets
// >> description: Aprimora um formulário com várias caixas de seleção ou botões de opções personalizáveis.
// >> docs: http://api.jqueryui.com/checkboxradio/
// >> demos: http://jqueryui.com/checkboxradio/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.structure: ../../themes/base/checkboxradio.css
//>>css.theme: ../../themes/base/theme.css



$ .widget ("ui.checkboxradio", [$ .ui.formResetMixin, {
	versão: "1.12.1",
	opções: {
		desativado: nulo
		label: null,
		ícone: verdadeiro
		classes: {
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-icon": "ui-canto-tudo"
		}
	}

	_getCreateOptions: function () {
		var desativado, rótulos;
		var isso = isto;
		var options = this._super () || {};

		// Nós lemos o tipo aqui, porque faz mais sentido lançar um erro de tipo de elemento primeiro,
		// em vez do erro por falta de um rótulo. Muitas vezes, se é do tipo errado,
		// não terá um rótulo (por exemplo, chamando um div, btn, etc)
		this._readType ();

		labels = this.element.labels ();

		// Se houver vários marcadores, use o último
		this.label = $ (labels [labels.length - 1]);
		if (! this.label.length) {
			$ .error ("Nenhum rótulo encontrado para o widget checkboxradio");
		}

		this.originalLabel = "";

		// Precisamos obter o texto da etiqueta, mas isso também pode precisar garantir que ela não contenha
		// entra em si.
		this.label.contents (). not (this.element [0]) .each (function () {

			// O conteúdo da etiqueta pode ser texto, html ou uma mistura. Nós concatenamos cada elemento para obter
			// representação de string do rótulo, sem a entrada como parte dele.
			that.originalLabel + = this.nodeType === 3? $ (this) .text (): this.outerHTML;
		});

		// Defina a opção de etiqueta se encontrarmos texto de etiqueta
		if (this.originalLabel) {
			options.label = this.originalLabel;
		}

		disabled = this.element [0] .disabled;
		if (desativado! = nulo) {
			options.disabled = desativado;
		}
		opções de retorno;
	}

	_create: function () {
		var checked = this.element [0]. conferido;

		this._bindFormResetHandler ();

		if (this.options.disabled == null) {
			this.options.disabled = this.element [0] .disabled;
		}

		this._setOption ("desativado", this.options.disabled);
		this._addClass ("ui-checkboxradio", "ui-helper-hidden-accessible");
		this._addClass (this.label, "ui-checkboxradio-label", "ui-button ui-widget");

		if (this.type === "radio") {
			this._addClass (this.label, "ui-checkboxradio-radio-label");
		}

		if (this.options.label && this.options.label! == this.originalLabel) {
			this._updateLabel ();
		} else if (this.originalLabel) {
			this.options.label = this.originalLabel;
		}

		this._enhance ();

		if (marcado) {
			this._addClass (this.label, "ui-checkboxradio-checked", "ui-state-active");
			if (this.icon) {
				this._addClass (this.icon, null, "ui-state-hover");
			}
		}

		this._on ({
			alterar: "_toggleClasses",
			focus: function () {
				this._addClass (this.label, null, "ui-estado-foco ui-visual-focus");
			}
			blur: function () {
				this._removeClass (this.label, null, "ui-estado-foco ui-visual-focus");
			}
		});
	}

	_readType: function () {
		var nodeName = this.element [0] .nodeName.toLowerCase ();
		this.type = this.element [0] .type;
		if (nodeName! == "entrada" ||! / radio | checkbox / .test (this.type)) {
			$ .error ("Não é possível criar checkboxradio em element.nodeName =" + nodeName +
				"e element.type =" + this.type);
		}
	}

	// Suporte a opção aprimorada do jQuery Mobile
	_enhance: function () {
		this._updateIcon (this.element [0] .checked);
	}

	widget: function () {
		return this.label;
	}

	_getRadioGroup: function () {
		grupo var;
		nome do var = this.element [0] .name;
		var nameSelector = "entrada [name = '" + $ .ui.escapeSelector (name) + "']";

		if (! name) {
			return $ ([]);
		}

		if (this.form.length) {
			group = $ (this.form [0] .elements) .filter (nameSelector);
		} outro {

			// Não dentro de um formulário, verifique todas as entradas que também não estão dentro de um formulário
			group = $ (nameSelector) .filter (function () {
				return $ (this) .form (). length === 0;
			});
		}

		return group.not (this.element);
	}

	_toggleClasses: function () {
		var checked = this.element [0]. conferido;
		this._toggleClass (this.label, "ui-checkboxradio-checked", "ui-state-active", verificado);

		if (this.options.icon && this.type === "checkbox") {
			this._toggleClass (this.icon, null, "ui-icon-check ui-state-checked", marcado)
				._toggleClass (this.icon, null, "ui-icon-blank",! verificado);
		}

		if (this.type === "radio") {
			this._getRadioGroup ()
				.each (function () {
					var instance = $ (this) .checkboxradio ("instance");

					if (instance) {
						instance._removeClass (instance.label,
							"ui-checkboxradio-checked", "ui-state-active");
					}
				});
		}
	}

	_destroy: function () {
		this._unbindFormResetHandler ();

		if (this.icon) {
			this.icon.remove ();
			this.iconSpace.remove ();
		}
	}

	_setOption: function (key, value) {

		// Não permitimos que o valor seja definido para nada
		if (key === "label" &&! value) {
			Retorna;
		}

		this._super (chave, valor);

		if (chave === "desativado") {
			this._toggleClass (this.label, null, "ui-state-disabled", valor);
			this.element [0] .disabled = valor;

			// Não atualize quando estiver desabilitado
			Retorna;
		}
		this.refresh ();
	}

	_updateIcon: function (checked) {
		var toAdd = "ui-ícone ui-ícone-fundo";

		if (this.options.icon) {
			if (! this.icon) {
				this.icon = $ ("<span>");
				this.iconSpace = $ ("<span> </ span>");
				this._addClass (this.iconSpace, "ui-checkboxradio-icon-space");
			}

			if (this.type === "checkbox") {
				toAdd + = verificado? "ui-icon-check ui-state-checked": "ui-icon-blank";
				this._removeClass (this.icon, null, checked? "ui-icon-blank": "ui-icon-check");
			} outro {
				toAdd + = "ui-icon-blank";
			}
			this._addClass (this.icon, "ui-checkboxradio-icon", toAdd);
			if (! checked) {
				this._removeClass (this.icon, null, "ui-icon-check ui-state-checked");
			}
			this.icon.prependTo (this.label) .after (this.iconSpace);
		} else if (this.icon! == undefined) {
			this.icon.remove ();
			this.iconSpace.remove ();
			delete this.icon;
		}
	}

	_updateLabel: function () {

		// Remove o conteúdo do rótulo (menos o ícone, o espaço do ícone e a entrada)
		var contents = this.label.contents (). não (this.element [0]);
		if (this.icon) {
			contents = contents.not (this.icon [0]);
		}
		if (this.iconSpace) {
			contents = contents.not (this.iconSpace [0]);
		}
		contents.remove ();

		this.label.append (this.options.label);
	}

	refresh: function () {
		var checked = this.element [0] .queque,
			isDisabled = this.element [0] .disabled;

		this._updateIcon (marcado);
		this._toggleClass (this.label, "ui-checkboxradio-checked", "ui-state-active", verificado);
		if (this.options.label! == null) {
			this._updateLabel ();
		}

		if (isDisabled! == this.options.disabled) {
			this._setOptions ({"disabled": isDisabled});
		}
	}

}]);

var widgetsCheckboxradio = $ .ui.checkboxradio;


/ *!
 * jQuery UI Button 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Button
// >> group: Widgets
// >> description: Aprimora um formulário com botões personalizáveis.
// >> docs: http://api.jqueryui.com/button/
// >> demos: http://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css



$ .widget ("ui.button", {
	versão: "1.12.1",
	defaultElement: "<button>",
	opções: {
		classes: {
			"ui-button": "ui-corner-all"
		}
		desativado: nulo
		ícone: null,
		iconPosition: "início",
		label: null,
		showLabel: true
	}

	_getCreateOptions: function () {
		var desativado

			// Isto é para suportar casos como no jQuery Mobile, onde o widget base tem
			// uma implementação de _getCreateOptions
			opções = this._super () || {};

		this.isInput = this.element.is ("entrada");

		disabled = this.element [0] .disabled;
		if (desativado! = nulo) {
			options.disabled = desativado;
		}

		this.originalLabel = this.isInput? this.element.val (): this.element.html ();
		if (this.originalLabel) {
			options.label = this.originalLabel;
		}

		opções de retorno;
	}

	_create: function () {
		if (! this.option.showLabel &! this.options.icon) {
			this.options.showLabel = true;
		}

		// Temos que verificar a opção novamente aqui mesmo que tenhamos feito em _getCreateOptions,
		// porque nulo pode ter sido passado no init, o que sobrescreveria o que foi definido em
		// _getCreateOptions
		if (this.options.disabled == null) {
			this.options.disabled = this.element [0] .disabled || falso;
		}

		this.hasTitle = !! this.element.attr ("título");

		// Verifique se o rótulo precisa ser definido ou se já está correto
		if (this.options.label && this.options.label! == this.originalLabel) {
			if (this.isInput) {
				this.element.val (this.options.label);
			} outro {
				this.element.html (this.options.label);
			}
		}
		this._addClass ("ui-button", "ui-widget");
		this._setOption ("desativado", this.options.disabled);
		this._enhance ();

		if (this.element.is ("a")) {
			this._on ({
				"keyup": function (event) {
					if (event.keyCode === $ .ui.keyCode.SPACE) {
						event.preventDefault ();

						// Suporte: PhantomJS <= 1,9, IE 8 somente
						// Se um clique nativo estiver disponível, use-o para realmente causar navegação
						// caso contrário, apenas acione um evento de clique
						if (this.element [0] .clique) {
							this.element [0] .click ();
						} outro {
							this.element.trigger ("clique");
						}
					}
				}
			});
		}
	}

	_enhance: function () {
		if (! this.element.is ("button")) {
			this.element.attr ("papel", "botão");
		}

		if (this.options.icon) {
			this._updateIcon ("ícone", this.options.icon);
			this._updateTooltip ();
		}
	}

	_updateTooltip: function () {
		this.title = this.element.attr ("título");

		if (! this.options.showLabel &&! this.title) {
			this.element.attr ("title", this.options.label);
		}
	}

	_updateIcon: function (option, value) {
		var icon = option! == "iconPosition",
			posição = ícone? this.options.iconPosition: value,
			displayBlock = position === "top" || posição === "bottom";

		// Criar ícone
		if (! this.icon) {
			this.icon = $ ("<span>");

			this._addClass (this.icon, "ui-button-icon", "ícone-ui");

			if (! this.options.showLabel) {
				this._addClass ("ui-button-icon-only");
			}
		} else if (ícone) {

			// Se estivermos atualizando o ícone, remova a classe de ícones antiga
			this._removeClass (this.icon, null, this.options.icon);
		}

		// Se estivermos atualizando o ícone, adicione a nova classe de ícones
		if (ícone) {
			this._addClass (this.icon, null, value);
		}

		this._attachIcon (posição);

		// Se o ícone estiver na parte superior ou inferior, precisamos adicionar a classe ui-widget-icon-block e remover
		// o iconSpace, se houver um.
		if (displayBlock) {
			this._addClass (this.icon, null, "ui-widget-ícone-bloco");
			if (this.iconSpace) {
				this.iconSpace.remove ();
			}
		} outro {

			// A posição está começando ou terminando, então remova a classe ui-widget-icon-block e adicione o
			// espaço se não existir
			if (! this.iconSpace) {
				this.iconSpace = $ ("<span> </ span>");
				this._addClass (this.iconSpace, "ui-button-icon-space");
			}
			this._removeClass (this.icon, null, "ui-wiget-ícone-bloco");
			this._attachIconSpace (posição);
		}
	}

	_destroy: function () {
		this.element.removeAttr ("role");

		if (this.icon) {
			this.icon.remove ();
		}
		if (this.iconSpace) {
			this.iconSpace.remove ();
		}
		if (! this.hasTitle) {
			this.element.removeAttr ("título");
		}
	}

	_attachIconSpace: function (iconPosition) {
		this.icon [/ ^ (?: end | bottom) /. test (iconPosition)? "before": "after"] (this.iconSpace);
	}

	_attachIcon: function (iconPosition) {
		this.element [/ ^ (?: end | bottom) /. test (iconPosition)? "append": "prepend"] (this.icon);
	}

	_setOptions: function (options) {
		var newShowLabel = options.showLabel === indefinido?
				this.options.showLabel:
				options.showLabel,
			newIcon = options.icon === indefinido? this.options.icon: options.icon;

		if (! newShowLabel &&! newIcon) {
			options.showLabel = true;
		}
		this._super (opções);
	}

	_setOption: function (key, value) {
		if (chave === "ícone") {
			if (valor) {
				this._updateIcon (chave, valor);
			} else if (this.icon) {
				this.icon.remove ();
				if (this.iconSpace) {
					this.iconSpace.remove ();
				}
			}
		}

		if (chave === "iconPosition") {
			this._updateIcon (chave, valor);
		}

		// Certifique-se de que não podemos terminar com um botão sem texto nem ícone
		if (chave === "showLabel") {
				this._toggleClass ("ui-button-icon-only", nulo,! valor);
				this._updateTooltip ();
		}

		if (chave === "label") {
			if (this.isInput) {
				this.element.val (valor);
			} outro {

				// Se houver um ícone, anexe-o, senão nada, acrescente o valor
				// isso evita a remoção do ícone ao configurar o texto do rótulo
				this.element.html (valor);
				if (this.icon) {
					this._attachIcon (this.options.iconPosition);
					this._attachIconSpace (this.options.iconPosition);
				}
			}
		}

		this._super (chave, valor);

		if (chave === "desativado") {
			this._toggleClass (null, "ui-state-disabled", valor);
			this.element [0] .disabled = valor;
			if (valor) {
				this.element.blur ();
			}
		}
	}

	refresh: function () {

		// Certifique-se de verificar apenas desativado se for um elemento que suporte isso de outra forma
		// verifique se a classe desativada determina o estado
		var isDisabled = this.element.is ("entrada, botão")?
			this.element [0] .disabled: this.element.hasClass ("ui-button-disabled");

		if (isDisabled! == this.options.disabled) {
			this._setOptions ({disabled: isDisabled});
		}

		this._updateTooltip ();
	}
});

// DESCONTINUADA
if ($ .uiBackCompat! == false) {

	// Opções de texto e ícones
	$ .widget ("ui.button", $ .ui.button, {
		opções: {
			texto: verdadeiro
			ícones: {
				primário: null,
				secundário: nulo
			}
		}

		_create: function () {
			if (this.options.showLabel &&! this.options.text) {
				this.options.showLabel = this.options.text;
			}
			if (! this.options.showLabel && this.options.text) {
				this.options.text = this.options.showLabel;
			}
			if (! this.options.icon && (this.options.icons.primary ||
					this.options.icons.secondary)) {
				if (this.options.icons.primary) {
					this.options.icon = this.options.icons.primary;
				} outro {
					this.options.icon = this.options.icons.secondary;
					this.options.iconPosition = "end";
				}
			} else if (this.options.icon) {
				this.options.icons.primary = this.options.icon;
			}
			this._super ();
		}

		_setOption: function (key, value) {
			if (chave === "texto") {
				this._super ("showLabel", valor);
				Retorna;
			}
			if (chave === "showLabel") {
				this.options.text = valor;
			}
			if (chave === "ícone") {
				this.options.icons.primary = valor;
			}
			if (chave === "ícones") {
				if (value.primary) {
					this._super ("ícone", value.primary);
					this._super ("iconPosition", "começo");
				} else if (value.secondary) {
					this._super ("ícone", valor.secundário);
					this._super ("iconPosition", "end");
				}
			}
			this._superApply (argumentos);
		}
	});

	$ .fn.button = (função (orig) {
		função de retorno () {
			if (! this.length || (this.length && this [0] .tagName! == "INPUT") ||
					(this.length && this [0] .tagName === "ENTRADA" && (
						this.attr ("type")! == "checkbox" && this.attr ("type")! == "radio"
					))) {
				return orig.apply (isto, argumentos);
			}
			if (! $. ui.checkboxradio) {
				$ .error ("Widget do Checkboxradio faltando");
			}
			if (arguments.length === 0) {
				devolve this.checkboxradio ({
					"ícone": falso
				});
			}
			devolve this.checkboxradio.apply (isto, argumentos);
		};
	}) ($. fn.button);

	$ .fn.buttonset = function () {
		if (! $. ui.controlgroup) {
			$ .error ("Widget do grupo de controle em falta");
		}
		if (arguments [0] === "option" && argumentos [1] === "itens" && argumentos [2]) {
			devolve this.controlgroup.apply (isto
				[argumentos [0], "items.button", argumentos [2]]);
		}
		if (argumentos [0] === "opção" && argumentos [1] === "itens") {
			return this.controlgroup.apply (isto, [argumentos [0], "items.button"]);
		}
		if (tipo de argumentos [0] === "objeto" && argumentos [0] .items) {
			argumentos [0] .items = {
				botão: argumentos [0] .items
			};
		}
		return this.controlgroup.apply (isto, argumentos);
	};
}

var widgetsButton = $ .ui.button;


// jscs: disable maximumLineLength
/ * jscs: disable requireCamelCaseOrUpperCaseIdentifiers * /
/ *!
 * jQuery UI Datepicker 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Datepicker
// >> group: Widgets
// >> description: Exibe um calendário de uma entrada ou inline para selecionar datas.
// >> docs: http://api.jqueryui.com/datepicker/
// >> demos: http://jqueryui.com/datepicker/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/datepicker.css
//>>css.theme: ../../themes/base/theme.css



$ .extend ($ .ui, {datepicker: {versão: "1.12.1"}});

var datepicker_instActive;

function datepicker_getZindex (elem) {
	var position, value;
	while (elem.length && elem [0]! == documento) {

		// Ignore z-index se a posição estiver definida para um valor em que z-index é ignorado pelo navegador
		// Isso torna o comportamento dessa função consistente entre os navegadores
		// O WebKit sempre retorna auto se o elemento estiver posicionado
		position = elem.css ("position");
		if (position === "absolute" || position === "relative" || posição === "fixed") {

			// IE retorna 0 quando o zIndex não é especificado
			// outros navegadores retornam uma string
			// nós ignoramos o caso de elementos aninhados com um valor explícito de 0
			// <div style = "z-index: -10;"> <div style = "z-index: 0;"> </ div> </ div>
			value = parseInt (elem.css ("zIndex"), 10);
			if (! isNaN (value) && value! == 0) {
				valor de retorno;
			}
		}
		elem = elem.parent ();
	}

	return 0;
}
/ * Gerenciador de seleção de data.
   Use a instância singleton dessa classe, $ .datepicker, para interagir com o selecionador de data.
   Configurações para (grupos de) selecionadores de data são mantidas em um objeto de instância,
   permitindo várias configurações diferentes na mesma página. * /

function Datepicker () {
	this._curInst = null; // A instância atual em uso
	this._keyEvent = false; // Se o último evento foi um evento chave
	this._disabledInputs = []; // Lista de entradas do selecionador de data que foram desativadas
	this._datepickerShowing = false; // Verdadeiro se o selecionador pop-up estiver sendo exibido, falso, se não
	this._inDialog = false; // Verdadeiro se aparecer dentro de um "diálogo", falso se não for
	this._mainDivId = "ui-datepicker-div"; // O ID da divisão principal do datepicker
	this._inlineClass = "ui-datepicker-inline"; // O nome da classe do marcador embutido
	this._appendClass = "ui-datepicker-append"; // O nome da classe do marcador de acréscimo
	this._triggerClass = "ui-datepicker-trigger"; // O nome da classe do marcador do acionador
	this._dialogClass = "ui-datepicker-dialog"; // O nome da classe do marcador de diálogo
	this._disableClass = "ui-datepicker-disabled"; // O nome da classe de marcador de cobertura desativada
	this._unselectableClass = "ui-datepicker-não selecionável"; // O nome da classe de marcador de célula não selecionável
	this._currentClass = "ui-datepicker-current-day"; // O nome da classe do marcador do dia atual
	this._dayOverClass = "ui-datepicker-days-cell-over"; // O nome da classe do marcador de hover do dia
	this.regional = []; // Configurações regionais disponíveis, indexadas por código de idioma
	this.regional [""] = {// Configurações regionais padrão
		closeText: "Concluído", // Exibir texto para link estreito
		prevText: "Anterior", // Exibir texto do link do mês anterior
		nextText: "Próximo", // Exibir texto para o link do próximo mês
		currentText: "Today", // Exibir texto para o link do mês atual
		monthNames: ["January", "February", "March", "April", "May", "June",
			"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], // Nomes de meses para drop-down e formatação
		monthNamesShort: ["Jan", "Feb", "Mar", "Abr", "Maio", "Jun", "Jul", "Aug", "Set", "Out", "Nov", "Dez" ], // para formatação
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // para formatação
		dayNamesShort: ["Sun", "Mon", "Ter", "Qua", "Qui", "Sex", "Sat"], // Para formatação
		dayNamesMin: ["Su", "Mo", "Tu", "Nós", "Th", "Fr", "Sa"], // Cabeçalhos de coluna para dias a partir de domingo
		weekHeader: "Wk", // Cabeçalho da coluna para a semana do ano
		dateFormat: "mm / dd / aa", // Veja as opções de formato em parseDate
		firstDay: 0, // O primeiro dia da semana, Sun = 0, Mon = 1, ...
		isRTL: false, // Verdadeiro se for da direita para a esquerda, false se da esquerda para a direita
		showMonthAfterYear: false, // True se o ano selecionar precede month, false for month then year
		yearSuffix: "" // Texto adicional para anexar ao ano nos cabeçalhos do mês
	};
	this._defaults = {// Padrões globais para todas as instâncias do selecionador de data
		showOn: "foco", // "foco" para pop-up em foco,
			// "botão" para o botão de disparo ou "ambos" para qualquer
		showAnim: "fadeIn", // Nome da animação do jQuery para pop-up
		showOptions: {}, // Opções para animações aprimoradas
		defaultDate: null, // Usado quando o campo está em branco: data real,
			// +/- number for offset de hoje, null para hoje
		appendText: "", // Exibe o texto após a caixa de entrada, por exemplo, mostrando o formato
		buttonText: "...", // Texto para o botão do gatilho
		buttonImage: "", // URL para imagem do botão do acionador
		buttonImageOnly: false, // True se a imagem aparecer sozinha, false se aparecer em um botão
		hideIfNoPrevNext: false, // True para esconder os links do próximo mês / anterior
			// se não for aplicável, false para desativá-los
		navigationAsDateFormat: false, // True se a formatação de data for aplicada aos links anterior / atual / seguinte
		gotoCurrent: false, // Verdadeiro se o link de hoje voltar para a seleção atual
		changeMonth: false, // True se o mês puder ser selecionado diretamente, false se apenas prev / next
		changeYear: false, // Verdadeiro se ano pode ser selecionado diretamente, falso se apenas prev / next
		yearRange: "c-10: c + 10", // intervalo de anos para exibir na lista suspensa,
			// em relação ao ano de hoje (-nn: + nn), relativo ao ano exibido no momento
			// (cnn: c + nn), absoluto (nnnn: nnnn) ou uma combinação do acima (nnnn: -n)
		showOtherMonths: false, // True para mostrar datas em outros meses, false para deixar em branco
		selectOtherMonths: false, // True para permitir a seleção de datas em outros meses, false para não selecionável
		showWeek: false, // True para mostrar a semana do ano, false para não mostrar
		calculateWeek: this.iso8601Week, // Como calcular a semana do ano,
			// pega uma data e retorna o número da semana para ela
		shortYearCutoff: "+10", // Valores do ano curto <este é no século atual,
			//> isso é no século anterior,
			// valor da string começando com "+" para o ano atual + valor
		minDate: null, // A primeira data selecionável ou null para sem limite
		maxDate: null, // A última data selecionável, ou null para sem limite
		duração: "fast", // Duração da exibição / fechamento
		beforeShowDay: null, // Função que pega uma data e retorna uma matriz com
			// [0] = verdadeiro se selecionável, falso se não, [1] = nome (s) de classe CSS customizado ou "",
			// [2] = título da célula (opcional), por exemplo, $ .datepicker.noWeekends
		beforeShow: null, // Função que usa um campo de entrada e
			// retorna um conjunto de configurações personalizadas para o selecionador de data
		onSelect: null, // Define uma função de retorno quando uma data é selecionada
		onChangeMonthYear: null, // Define uma função de retorno de chamada quando o mês ou ano é alterado
		onClose: null, // Definir uma função de retorno de chamada quando o criador de data está fechado
		numberOfMonths: 1, // Número de meses para mostrar de cada vez
		showCurrentAtPos: 0, // A posição em meses multipeais na qual mostrar o mês atual (começando em 0)
		stepMon ths: 1, // Número de meses a recuar / avançar
		stepBigMonths: 12, // Número de meses para voltar / avançar para os grandes links
		altField: "", // Seletor para um campo alternativo para armazenar datas selecionadas
		altFormat: "", // O formato de data a ser usado para o campo alternativo
		constrainInput: true, // A entrada é restrita pelo formato de data atual
		showButtonPanel: false, // True para mostrar o painel de botões, false para não mostrar
		autoSize: false, // True para dimensionar a entrada para o formato de data, false para deixar como está
		disabled: false // O estado inicial desativado
	};
	$ .extend (this._defaults, this.regional [""]);
	this.regional.en = $ .extend (true, {}, this.regional [""]);
	this.regional ["en-US"] = $ .extend (true, {}, this.regional.en);
	this.dpDiv = datepicker_bindHover ($ ("<div id = '" + this._mainDivId + "' classe = 'ui-datepicker interface do usuário ui-widget-conteúdo ui-helper-clearfix ui-canto-tudo'> </ div> "));
}

$ .extend (Datepicker.prototype, {
	/ * Nome da classe adicionado aos elementos para indicar já configurado com um selecionador de data. * /
	markerClassName: "hasDatepicker",

	// Acompanhe o número máximo de linhas exibidas (veja # 7043)
	maxRows: 4,

	// TODO renomeia para "widget" ao alternar para fábrica de widgets
	_widgetDatepicker: function () {
		return this.dpDiv;
	}

	/ * Substitua as configurações padrão de todas as instâncias do selecionador de data.
	 * @param settings object - as novas configurações para usar como padrões (objeto anônimo)
	 * @retornar o objeto gerenciador
	 * /
	setDefaults: function (settings) {
		datepicker_extendRemove (this._defaults, settings || {});
		devolva isto;
	}

	/ * Anexe o selecionador de data a uma seleção de jQuery.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @param settings object - as novas configurações a serem usadas para esta instância do selecionador de data (anônimo)
	 * /
	_attachDatepicker: function (target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase ();
		inline = (nodeName === "div" || nodeName === "span");
		if (! target.id) {
			this.uuid + = 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst ($ (target), inline);
		inst.settings = $ .extend ({}, configurações || {});
		if (nodeName === "entrada") {
			this._connectDatepicker (target, inst);
		} else if (inline) {
			this._inlineDatepicker (target, inst);
		}
	}

	/ * Crie um novo objeto de instância. * /
	_newInst: function (target, inline) {
		var id = destino [0] .id.replace (/ ([^ A-Za-z0-9 _ \ -]) / g, "\\\\ $ 1"); // escape de meta-caracteres jQuery
		return {id: id, input: target, // target associado
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // seleção atual
			drawMonth: 0, drawYear: 0, // mês sendo desenhado
			inline: inline, // é datepicker inline ou não
			dpDiv: (! inline? this.dpDiv: // presentation div
			datepicker_bindHover ($ ("<div class = '" + this._inlineClass + "ui-datepicker ui-widget ui-widget-conteúdo ui-helper-clearfix ui-canto-tudo'> </ div>")))};
	}

	/ * Anexe o selecionador de data a um campo de entrada. * /
	_connectDatepicker: function (target, inst) {
		var input = $ (target);
		inst.append = $ ([]);
		inst.trigger = $ ([]);
		if (input.hasClass (this.markerClassName)) {
			Retorna;
		}
		this._attachments (entrada, inst);
		input.addClass (this.markerClassName) .on ("keydown", this._doKeyDown).
			on ("keypress", this._doKeyPress) .on ("keyup", this._doKeyUp);
		this._autoSize (inst);
		$ .data (target, "datepicker", inst);

		// Se a opção desabilitada for verdadeira, desative o contador de data assim que ele for anexado à entrada (consulte o ticket nº 5665)
		if (inst.settings.disabled) {
			this._disableDatepicker (target);
		}
	}

	/ * Faça anexos com base nas configurações. * /
	_attachments: function (input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get (inst, "appendText"),
			isRTL = this._get (inst, "isRTL");

		if (inst.append) {
			inst.append.remove ();
		}
		if (appendText) {
			inst.append = $ ("<span class = '" + this._appendClass + "'>" + appendText + "</ span>");
			entrada [isRTL? "before": "after"] (inst.append);
		}

		input.off ("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove ();
		}

		showOn = this._get (inst, "showOn");
		if (showOn === "foco" || showOn === "both") {// selecionador de data pop-up quando no campo marcado
			input.on ("focus", this._showDatepicker);
		}
		if (showOn === "botão" || showOn === "both") {// selecionador de data pop-up quando o botão clicou
			buttonText = this._get (inst, "buttonText");
			buttonImage = this._get (inst, "buttonImage");
			inst.trigger = $ (this._get (inst, "buttonImageOnly")?
				$ ("<img />") .addClass (this._triggerClass).
					attr ({src: buttonImage, alt: buttonText, título: buttonText}):
				$ ("<button type = 'button'> </ button>") .addClass (this._triggerClass).
					html (! buttonImage? buttonText: $ ("<img />") .attr (
					{src: buttonImage, alt: buttonText, title: buttonText})));
			entrada [isRTL? "antes": "depois"] (inst.trigger);
			inst.trigger.on ("click", function () {
				if ($ .datepicker._datepickerShowing && $ .datepicker._lastInput === input [0]) {
					$ .datepicker._hideDatepicker ();
				} else if ($ .datepicker._datepickerShowing && $ .datepicker._lastInput! == input [0]) {
					$ .datepicker._hideDatepicker ();
					$ .datepicker._showDatepicker (input [0]);
				} outro {
					$ .datepicker._showDatepicker (input [0]);
				}
				retorna falso;
			});
		}
	}

	/ * Aplique o comprimento máximo para o formato de data. * /
	_autoSize: function (inst) {
		if (this._get (inst, "autoSize") &&! inst.inline) {
			var findMax, max, maxI, i,
				date = new Date (2009, 12 - 1, 20), // Assegure dois dígitos
				dateFormat = this._get (inst, "dateFormat");

			if (dateFormat.match (/ [DM] /)) {
				findMax = função (nomes) {
					max = 0;
					maxI = 0;
					para (i = 0; i <names.length; i ++) {
						if (nomes [i] .comprimento> max) {
							max = nomes [i] .comprimento;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth (findMax (this._get (inst, (dateFormat.match (/ MM /)?
					"monthNames": "monthNamesShort"))));
				date.setDate (findMax (this._get (inst, (dateFormat.match (/ DD /)?
					"dayNames": "dayNamesShort"))) + 20 - date.getDay ());
			}
			inst.input.attr ("size", this._formatDate (inst, date) .length);
		}
	}

	/ * Anexar um seletor de data in-line a um div. * /
	_inlineDatepicker: function (target, inst) {
		var divSpan = $ (destino);
		if (divSpan.hasClass (this.markerClassName)) {
			Retorna;
		}
		divSpan.addClass (this.markerClassName) .append (inst.dpDiv);
		$ .data (target, "datepicker", inst);
		this._setDate (inst, this._getDefaultDate (inst), true);
		this._updateDatepicker (inst);
		this._updateAlternate (inst);

		// Se a opção disabled for verdadeira, desabilite o datepicker antes de mostrá-lo (veja o ticket # 5665)
		if (inst.settings.disabled) {
			this._disableDatepicker (target);
		}

		// Set display: block no lugar de inst.dpDiv.show () que não funcionará em elementos desconectados
		// http://bugs.jqueryui.com/ticket/7552 - Um DatePicker criado em um div separado tem altura zero
		inst.dpDiv.css ("display", "block");
	}

	/ * Pop-up o selecionador de data em uma caixa de diálogo.
	 elemento de entrada @param - ignorado
	 * @param date string ou Date - a data inicial a ser exibida
	 * @param onSelect function - a função para chamar quando uma data é selecionada
	 * @param settings object - atualiza as configurações da instância do selecionador de data do diálogo (objeto anônimo)
	 * @param pos int [2] - coordenadas para a posição do diálogo dentro da tela ou
	 * evento - com coordenadas x / y ou
	 * deixe vazio por padrão (centro da tela)
	 * @retornar o objeto gerenciador
	 * /
	_dialogDatepicker: function (input, date, onSelect, configurações, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // instância interna

		if (! inst) {
			this.uuid + = 1;
			id = "dp" + this.uuid;
			this._dialogInput = $ ("<tipo de entrada = 'texto' id = '" + id +
				"'style =' position: absolute; top: -100px; largura: 0px; '/>");
			this._dialogInput.on ("keydown", this._doKeyDown);
			$ ("body") .append (this._dialogInput);
			inst = this._dialogInst = this._newInst (this._dialogInput, false);
			inst.settings = {};
			$ .data (this._dialogInput [0], "datepicker", inst);
		}
		datepicker_extendRemove (inst.settings, settings || {});
		date = (date && date.constructor === Data? this._formatDate (inst, date): date);
		this._dialogInput.val (data);

		this._pos = (pos? (pos.length? pos: [pos.pageX, pos.pageY]): nulo);
		if (! this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // deve usar largura / altura real abaixo
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// Move a entrada na tela para o foco, mas oculta por trás do diálogo
		this._dialogInput.css ("left", (this._pos [0] + 20) + "px") .css ("topo", this._pos [1] + "px");
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass (this._dialogClass);
		this._showDatepicker (this._dialogInput [0]);
		if ($ .blockUI) {
			$ .blockUI (this.dpDiv);
		}
		$ .data (this._dialogInput [0], "datepicker", inst);
		devolva isto;
	}

	/ * Desanexe um datepicker do seu controle.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * /
	_destroyDatepicker: function (target) {
		var nodeName,
			$ target = $ (target),
			inst = $ .data (target, "datepicker");

		if (! $ target.hasClass (this.markerClassName)) {
			Retorna;
		}

		nodeName = target.nodeName.toLowerCase ();
		$ .removeData (target, "datepicker");
		if (nodeName === "entrada") {
			inst.append.remove ();
			inst.trigger.remove ();
			$ target.removeClass (this.markerClassName).
				off ("focus", this._showDatepicker).
				off ("keydown", this._doKeyDown).
				off ("keypress", this._doKeyPress).
				off ("keyup", this._doKeyUp);
		} else if (nodeName === "div" || nodeName === "span") {
			$ target.removeClass (this.markerClassName) .empty ();
		}

		if (datepicker_instActive === inst) {
			datepicker_instActive = null;
		}
	}

	/ * Habilite o selecionador de data para uma seleção de jQuery.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * /
	_enableDatepicker: function (target) {
		var nodeName, inline,
			$ target = $ (target),
			inst = $ .data (target, "datepicker");

		if (! $ target.hasClass (this.markerClassName)) {
			Retorna;
		}

		nodeName = target.nodeName.toLowerCase ();
		if (nodeName === "entrada") {
			target.disabled = false;
			inst.trigger.filter ("botão").
				each (function () {this.disabled = false;}) .end ().
				filtro ("img") .css ({opacidade: "1,0", cursor: ""});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $ target.children ("." + this._inlineClass);
			inline.children (). removeClass ("ui-state-disabled");
			inline.find ("select.ui-datepicker-month, select.ui-datepicker-year").
				prop ("desativado", falso);
		}
		this._disabledInputs = $ .map (this._disabledInputs,
			function (value) {return (valor === alvo? nulo: valor); }); // delete entry
	}

	/ * Desativar o selecionador de data para uma seleção de jQuery.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * /
	_disableDatepicker: function (target) {
		var nodeName, inline,
			$ target = $ (target),
			inst = $ .data (target, "datepicker");

		if (! $ target.hasClass (this.markerClassName)) {
			Retorna;
		}

		nodeName = target.nodeName.toLowerCase ();
		if (nodeName === "entrada") {
			target.disabled = true;
			inst.trigger.filter ("botão").
				each (function () {this.disabled = true;}) .end ().
				filter ("img") .css ({opacidade: "0.5", cursor: "default"});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $ target.children ("." + this._inlineClass);
			inline.children () addClass ("ui-state-disabled");
			inline.find ("select.ui-datepicker-month, select.ui-datepicker-year").
				prop ("desativado", verdadeiro);
		}
		this._disabledInputs = $ .map (this._disabledInputs,
			function (value) {return (valor === alvo? nulo: valor); }); // delete entry
		this._disabledInputs [this._disabledInputs.length] = target;
	}

	/ * O primeiro campo de uma coleção jQuery está desabilitado como um datepicker?
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @return boolean - true se desativado, false se ativado
	 * /
	_isDisabledDatepicker: function (target) {
		if (! target) {
			retorna falso;
		}
		para (var i = 0; i <this._disabledInputs.length; i ++) {
			if (this._disabledInputs [i] === target) {
				retorno verdadeiro;
			}
		}
		retorna falso;
	}

	/ * Recupere os dados da instância para o controle de destino.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @return object - os dados da instância associada
	 * @throws erro se um problema jQuery recebendo dados
	 * /
	_getInst: function (target) {
		experimentar {
			return $ .data (target, "datepicker");
		}
		pegar (err) {
			throw "Dados da instância ausente para este datepicker";
		}
	}

	/ * Atualize ou recupere as configurações de um selecionador de data anexado a um campo ou divisão de entrada.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @ nome do objeto objeto - as novas configurações para atualizar ou
	 * string - o nome da configuração para alterar ou recuperar
	 * ao recuperar também "all" para todas as configurações de instância ou
	 * "defaults" para todos os padrões globais
	 * @param valor algum - o novo valor para a configuração
	 * (omitir se acima é um objeto ou recuperar um valor)
	 * /
	_optionDatepicker: function (target, name, value) {
		var settings, date, minDate, maxDate,
			inst = this._getInst (destino);

		if (arguments.length === 2 && typeof name === "string") {
			return (name === "defaults"? $ .extend ({}, $ .datepicker._defaults):
				(inst? (name === "all"? $ .extend ({}, inst.settings):
				this._get (inst, name)): null));
		}

		configurações = nome || {};
		if (nome do tipo === "string") {
			configurações = {};
			configurações [nome] = valor;
		}

		if (inst) {
			if (this._curInst === inst) {
				this._hideDatepicker ();
			}

			date = this._getDateDatepicker (target, true);
			minDate = this._getMinMaxDate (inst, "min");
			maxDate = this._getMinMaxDate (inst, "max");
			datepicker_extendRemove (inst.settings, settings);

			// reformatar os valores antigos de minDate / maxDate se dateFormat mudar e um novo minDate / maxDate não for fornecido
			if (minDate! == null && settings.dateFormat! == undefined && settings.minDate === undefined) {
				inst.settings.minDate = this._formatDate (inst, minDate);
			}
			if (maxDate! == null && settings.dateFormat! == undefined && settings.maxDate === undefined) {
				inst.settings.maxDate = this._formatDate (inst, maxDate);
			}
			if ("desativado" nas configurações) {
				if (settings.disabled) {
					this._disableDatepicker (target);
				} outro {
					this._enableDatepicker (target);
				}
			}
			this._attachments ($ (target), inst);
			this._autoSize (inst);
			this._setDate (inst, date);
			this._updateAlternate (inst);
			this._updateDatepicker (inst);
		}
	}

	// Alterar método depreciado
	_changeDatepicker: function (target, name, value) {
		this._optionDatepicker (destino, nome, valor);
	}

	/ * Redesenhar o selecionador de data anexado a um campo de entrada ou divisão.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * /
	_refreshDatepicker: function (target) {
		var inst = this._getInst (target);
		if (inst) {
			this._updateDatepicker (inst);
		}
	}

	/ * Defina as datas para uma seleção de jQuery.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @param date Date - a nova data
	 * /
	_setDateDatepicker: function (target, date) {
		var inst = this._getInst (target);
		if (inst) {
			this._setDate (inst, date);
			this._updateDatepicker (inst);
			this._updateAlternate (inst);
		}
	}

	/ * Obtenha a (s) data (s) da primeira entrada em uma seleção jQuery.
	 * @param target element - o campo de entrada de destino ou divisão ou extensão
	 * @param noDefault boolean - true se nenhuma data padrão for usada
	 * @return Date - a data atual
	 * /
	_getDateDatepicker: function (target, noDefault) {
		var inst = this._getInst (target);
		if (inst &&! inst.inline) {
			this._setDateFromField (inst, noDefault);
		}
		return (inst? this._getDate (inst): null);
	}

	/ * Lidar com as teclas digitadas. * /
	_doKeyDown: function (event) {
		var onSelect, dateStr, sel,
			inst = $ .datepicker._getInst (event.target),
			manipulado = true
			isRTL = inst.dpDiv.is (".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($ .datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $ .datepicker._hideDatepicker ();
						manipulado = falso;
						quebrar; // esconder na tab out
				case 13: sel = $ ("td." + $ .datepicker._dayOverClass + ": não (." +
									$ .datepicker._currentClass + ")", inst.dpDiv);
						if (sel [0]) {
							$ .datepicker._selectDay (event.target, inst.selectedMonth, inst.selectedYear, sel [0]);
						}

						onSelect = $ .datepicker._get (inst, "onSelect");
						if (onSelect) {
							dateStr = $ .datepicker._formatDate (inst);

							// Trigger callback personalizado
							onSelect.apply ((inst.input? inst.input [0]: null), [dateStr, inst]);
						} outro {
							$ .datepicker._hideDatepicker ();
						}

						retorna falso; // não envie o formulário
				case 27: $ .datepicker._hideDatepicker ();
						quebrar; // esconder no escape
				case 33: $ .datepicker._adjustDate (event.target, (event.ctrlKey?)
							- $. datepicker._get (inst, "stepBigMonths"):
							- $. datepicker._get (inst, "stepMonths")), "M");
						quebrar; // mês anterior / ano na página up / + ctrl
				case 34: $ .datepicker._adjustDate (event.target, (event.ctrlKey?)
							+ $. datepicker._get (inst, "stepBigMonths"):
							+ $. datepicker._get (inst, "stepMonths")), "M");
						quebrar; // próximo mês / ano na página abaixo / + ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._clearDate (event.target);
						}
						manipulado = event.ctrlKey || event.metaKey;
						quebrar; // limpar no ctrl ou no comando + end
				case 36: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._gotoToday (event.target);
						}
						manipulado = event.ctrlKey || event.metaKey;
						quebrar; // current on ctrl ou command + home
				case 37: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._adjustDate (event.target, (isRTL? +1: -1), "D");
						}
						manipulado = event.ctrlKey || event.metaKey;

						// -1 dia no ctrl ou comando + esquerda
						if (event.originalEvent.altKey) {
							$ .datepicker._adjustDate (event.target, (event.ctrlKey?
								- $. datepicker._get (inst, "stepBigMonths"):
								- $. datepicker._get (inst, "stepMonths")), "M");
						}

						// próximo mês / ano no alt + deixado no Mac
						quebrar;
				case 38: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._adjustDate (event.target, -7, "D");
						}
						manipulado = event.ctrlKey || event.metaKey;
						quebrar; // -1 semana no ctrl ou comando + up
				case 39: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._adjustDate (event.target, (isRTL? -1: +1), "D");
						}
						manipulado = event.ctrlKey || event.metaKey;

						// +1 dia no ctrl ou comando + direito
						if (event.originalEvent.altKey) {
							$ .datepicker._adjustDate (event.target, (event.ctrlKey?
								+ $. datepicker._get (inst, "stepBigMonths"):
								+ $. datepicker._get (inst, "stepMonths")), "M");
						}

						// próximo mês / ano no alt + right
						quebrar;
				case 40: if (event.ctrlKey || event.metaKey) {
							$ .datepicker._adjustDate (event.target, +7, "D");
						}
						manipulado = event.ctrlKey || event.metaKey;
						quebrar; // +1 semana no ctrl ou comando + down
				padrão: handled = false;
			}
		} else if (event.keyCode === 36 && event.ctrlKey) {// exibe o selecionador de data em ctrl + home
			$ .datepicker._showDatepicker (isto);
		} outro {
			manipulado = falso;
		}

		if (handled) {
			event.preventDefault ();
			event.stopPropagation ();
		}
	}

	/ * Filtrar caracteres inseridos - com base no formato de data. * /
	_doKeyPress: function (event) {
		var chars, chr,
			inst = $ .datepicker._getInst (event.target);

		if ($ .datepicker._get (inst, "constrainInput")) {
			chars = $ .datepicker._possibleChars ($ .datepicker._get (inst, "dateFormat"));
			chr = String.fromCharCode (event.charCode == null? event.keyCode: event.charCode);
			return event.ctrlKey || event.metaKey || (chr <"" ||! chars || chars.indexOf (chr)> -1);
		}
	}

	/ * Sincronizar entrada manual e campo / campo alternativo. * /
	_doKeyUp: function (event) {
		var data,
			inst = $ .datepicker._getInst (event.target);

		if (inst.input.val ()! == inst.lastVal) {
			experimentar {
				date = $ .datepicker.parseDate ($ .datepicker._get (inst, "dateFormat"),
					(inst.input? inst.input.val (): null),
					$ .datepicker._getFormatConfig (inst));

				if (date) {// somente se válido
					$ .datepicker._setDateFromField (inst);
					$ .datepicker._updateAlternate (inst);
					$ .datepicker._updateDatepicker (inst);
				}
			}
			pegar (err) {
			}
		}
		retorno verdadeiro;
	}

	/ * Pop-up o selecionador de data para um determinado campo de entrada.
	 * Se false retornado do manipulador de eventos beforeShow não for mostrado.
	 * @param input element - o campo de entrada anexado ao selecionador de data ou
	 * evento - se acionado pelo foco
	 * /
	_showDatepicker: function (input) {
		input = input.target || entrada;
		if (input.nodeName.toLowerCase ()! == "input") {// achado do botão / acionador de imagem
			input = $ ("entrada", input.parentNode) [0];
		}

		if ($ .datepicker._isDisabledDatepicker (input) || $ .datepicker._lastInput === input) {// já aqui
			Retorna;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duração;

		inst = $ .datepicker._getInst (entrada);
		if ($ .datepicker._curInst && $ .datepicker._curInst! == inst) {
			$ .datepicker._curInst.dpDiv.stop (true, true);
			if (inst && $ .datepicker._datepickerShowing) {
				$ .datepicker._hideDatepicker ($ .datepicker._curInst.input [0]);
			}
		}

		beforeShow = $ .datepicker._get (inst, "beforeShow");
		beforeShowSettings = beforeShow? beforeShow.apply (input, [input, inst]): {};
		if (beforeShowSettings === false) {
			Retorna;
		}
		datepicker_extendRemove (inst.settings, beforeShowSettings);

		inst.lastVal = null;
		$ .datepicker._lastInput = input;
		$ .datepicker._setDateFromField (inst);

		if ($ .datepicker._inDialog) {// oculta o cursor
			input.value = "";
		}
		if (! $. datepicker._pos) {// posição abaixo da entrada
			$ .datepicker._pos = $ .datepicker._findPos (entrada);
			$ .datepicker._pos [1] + = input.offsetHeight; // adiciona a altura
		}

		isFixed = false;
		$ (entrada) .parents (). each (function () {
			isFixed | = $ (this) .css ("position") === "corrigido";
			return! isFixed;
		});

		offset = {left: $ .datepicker._pos [0], top: $ .datepicker._pos [1]};
		$ .datepicker._pos = null;

		// para evitar flashes no Firefox
		inst.dpDiv.empty ();

		// determine o dimensionamento fora da tela
		inst.dpDiv.css ({position: "absolute", display: "bloco", topo: "-1000px"});
		$ .datepicker._updateDatepicker (inst);

		// corrige a largura para o número dinâmico de selecionadores de data
		// e ajuste a posição antes de mostrar
		offset = $ .datepicker._checkOffset (inst, offset, isFixed);
		inst.dpDiv.css ({position: ($ .datepicker._inDialog && $ .blockUI?
			"static": (isFixed? "fixed": "absolute")), exibição: "none",
			left: offset.left + "px", top: offset.top + "px"});

		if (! inst.inline) {
			showAnim = $ .datepicker._get (inst, "showAnim");
			duration = $ .datepicker._get (inst, "duração");
			inst.dpDiv.css ("z-index", datepicker_getZindex ($ (input)) + 1);
			$ .datepicker._datepickerShowing = true;

			if ($ .effects && $ .effects.effect [showAnim]) {
				inst.dpDiv.show (showAnim, $ .datepicker._get (inst, "showOptions"), duração);
			} outro {
				inst.dpDiv [showAnim || "show"] (showAnim? duração: null);
			}

			if ($ .datepicker._shouldFocusInput (inst)) {
				inst.input.trigger ("focus");
			}

			$ .datepicker._curInst = inst;
		}
	}

	/ * Gere o conteúdo do selecionador de data. * /
	_updateDatepicker: function (inst) {
		this.maxRows = 4; // Redefine o número máximo de linhas exibidas (veja # 7043)
		datepicker_instActive = inst; // para eventos de foco do delegado
		inst.dpDiv.empty (). append (this._generateHTML (inst));
		this._attachHandlers (inst);

		var origyearshtml,
			numMonths = this._getNumberOfMonths (inst),
			cols = numMonths [1],
			largura = 17,
			activeCell = inst.dpDiv.find ("." + this._dayOverClass + "a");

		if (activeCell.length> 0) {
			datepicker_handleMouseover.apply (activeCell.get (0));
		}

		inst.dpDiv.removeClass ("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4") .width ("");
		if (cols> 1) {
			inst.dpDiv.addClass ("ui-datepicker-multi-" + cols) .css ("largura", (largura * cols) + "em");
		}
		inst.dpDiv [(numMonths [0]! == 1 || numMonths [1]! == 1? "adicionar": "remover") +
			"Classe"] ("ui-datepicker-multi");
		inst.dpDiv [(this._get (inst, "isRTL")? "adicionar": "remover") +
			"Classe"] ("ui-datepicker-rtl");

		if (inst === $ .datepicker._curInst && $ .datepicker._datepickerShowing && $ .datepicker._shouldFocusInput (inst)) {
			inst.input.trigger ("focus");
		}

		// Renderização diferida dos anos select (para evitar flashes no Firefox)
		if (inst.yearshtml) {
			origyearshtml = inst.yearshtml;
			setTimeout (function () {

				// assegurar que inst.yearshtml não tenha mudado.
				if (origyearshtml === inst.yearshtml && inst.yearshtml) {
					inst.dpDiv.find ("select.ui-datepicker-year: first") .replaceCom (inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	}

	// # 6694 - não focalize a entrada se ela já estiver focada
	// isso quebra o evento de alteração no IE
	// Suporte: IE e jQuery <1.9
	_shouldFocusInput: function (inst) {
		return inst.input && inst.input.is (": visible") &&! inst.input.is (": disabled") &&! inst.input.is (": focus");
	}

	/ * Verifique o posicionamento para permanecer na tela. * /
	_checkOffset: function (inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth (),
			dpHeight = inst.dpDiv.outerHeight (),
			inputWidth = inst.input? inst.input.outerWidth (): 0,
			inputHeight = inst.input? inst.input.outerHeight (): 0,
			viewWidth = document.documentElement.clientWidth + (isFixed? 0: $ (document) .scrollLeft ()),
			viewHeight = document.documentElement.clientHeight + (isFixed? 0: $ (document) .scrollTop ());

		offset.left - = (this._get (inst, "isRTL")? (dpWidth - inputWidth): 0);
		offset.left - = (isFixed && offset.left === inst.input.offset (). à esquerda)? $ (documento) .scrollLeft (): 0;
		offset.top - = (isFixed && offset.top === (inst.input.offset (). topo + inputHeight))? $ (documento) .scrollTop (): 0;

		// Agora, verifique se o datepicker está mostrando a janela de visualização da janela externa - mova para um lugar melhor, se for o caso.
		offset.left - = Math.min (offset.left, (offset.left + dpWidth> viewWidth && viewWidth> dpWidth)?
			Math.abs (offset.left + dpWidth - viewWidth): 0);
		offset.top - = Math.min (offset.top, (offset.top + dpAltura> viewHeight && viewHeight> dpHeight)?
			Math.abs (dpAltura + entradaHeight): 0);

		deslocamento de retorno;
	}

	/ * Encontre a posição de um objeto na tela. * /
	_findPos: function (obj) {
		var posição,
			inst = this._getInst (obj),
			isRTL = this._get (inst, "isRTL");

		while (obj && (obj.type === "oculto" || obj.nodeType! == 1 || $ .expr.filters.hidden (obj))) {
			obj = obj [isRTL? "previousSibling": "nextSibling"];
		}

		position = $ (obj) .offset ();
		return [position.left, position.top];
	}

	/ * Ocultar o seletor de datas da visualização.
	 * @param input element - o campo de entrada anexado ao selecionador de data
	 * /
	_hideDatepicker: function (input) {
		var showAnim, duração, postProcess, onClose,
			inst = this._curInst;

		if (! inst || (entrada && inst! == $ .data (entrada, "datepicker"))) {
			Retorna;
		}

		if (this._datepickerShowing) {
			showAnim = this._get (inst, "showAnim");
			duration = this._get (inst, "duração");
			postProcess = function () {
				$ .datepicker._tidyDialog (inst);
			};

			// DEPRECADO: após o BC para 1.8.x $ .effects [showAnim] não é necessário
			if ($ .effects && ($ .effects.effect [showAnim] || $ .effects [showAnim])) {
				inst.dpDiv.hide (showAnim, $ .datepicker._get (inst, "showOptions"), duração, postProcess);
			} outro {
				inst.dpDiv [(showAnim === "slideDown"? "slideUp":
					(showAnim === "fadeIn"? "fadeOut": "ocultar"))] ((showAnim? duração: nulo), postProcess);
			}

			if (! showAnim) {
				pós-processo();
			}
			this._datepickerShowing = false;

			onClose = this._get (inst, "onClose");
			if (onClose) {
				onClose.apply ((inst.input? inst.input [0]: null), [(inst.input? inst.input.val (): ""), inst]);
			}

			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css ({position: "absolute", left: "0", top: "-100px"});
				if ($ .blockUI) {
					$ .unblockUI ();
					$ ("body") .append (this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	}

	/ * Arrume depois de uma exibição de diálogo. * /
	_tidyDialog: function (inst) {
		inst.dpDiv.removeClass (this._dialogClass) .off (".ui-datepicker-calendar");
	}

	/ * Fechar seletor de data se clicado em outro lugar. * /
	_checkExternalClick: function (event) {
		if (! $. datepicker._curInst) {
			Retorna;
		}

		var $ target = $ (event.target),
			inst = $ .datepicker._getInst ($ target [0]);

		if ((($ target [0] .id! == $ .datepicker._mainDivId &&
				$ target.parents ("#" + $ .datepicker._mainDivId) .length === 0 &&
				! $ target.hasClass ($ .datepicker.markerClassName) &&
				! $ target.closest ("." + $ .datepicker._triggerClass) .length &&
				$ .datepicker._datepickerShowing &&! ($ .datepicker._inDialog && $ .blockUI))) ||
			($ target.hasClass ($ .datepicker.markerClassName) && $ .datepicker._curInst! == inst)) {
				$ .datepicker._hideDatepicker ();
		}
	}

	/ * Ajustar um dos sub-campos de data. * /
	_adjustDate: function (id, offset, period) {
		var target = $ (id),
			inst = this._getInst (target [0]);

		if (this._isDisabledDatepicker (target [0])) {
			Retorna;
		}
		this._adjustInstDate (inst, offset +
			(período === "M"? this._get (inst, "showCurrentAtPos"): 0), // desfazendo posicionamento
			período);
		this._updateDatepicker (inst);
	}

	/ * Ação para o link atual. * /
	_gotoToday: function (id) {
		var data,
			target = $ (id),
			inst = this._getInst (target [0]);

		if (this._get (inst, "gotoCurrent") && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} outro {
			date = new Date ();
			inst.selectedDay = date.getDate ();
			inst.drawMonth = inst.selectedMonth = date.getMonth ();
			inst.drawYear = inst.selectedYear = date.getFullYear ();
		}
		this._notifyChange (inst);
		this._adjustDate (target);
	}

	/ * Ação para selecionar um novo mês / ano. * /
	_selectMonthYear: function (id, select, period) {
		var target = $ (id),
			inst = this._getInst (target [0]);

		inst ["selected" + (período === "M"? "Mês": "Ano")] =
		inst ["draw" + (período === "M"? "Mês": "Ano")] =
			parseInt (select.options [select.selectedIndex] .value, 10);

		this._notifyChange (inst);
		this._adjustDate (target);
	}

	/ * Ação para selecionar um dia. * /
	_selectDay: function (id, mês, ano, td) {
		var inst,
			target = $ (id);

		if ($ (td) .hasClass (this._unselectableClass) || this._isDisabledDatepicker (target [0])) {
			Retorna;
		}

		inst = this._getInst (target [0]);
		inst.selectedDay = inst.currentDay = $ ("a", td) .html ();
		inst.selectedMonth = inst.currentMonth = mês;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate (id, this._formatDate (inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	}

	/ * Apaga o campo de entrada e oculta o selecionador de data. * /
	_clearDate: function (id) {
		var target = $ (id);
		this._selectDate (target, "");
	}

	/ * Atualize o campo de entrada com a data selecionada. * /
	_selectDate: function (id, dateStr) {
		var onSelect,
			target = $ (id),
			inst = this._getInst (target [0]);

		dateStr = (dateStr! = null? dateStr: this._formatDate (inst));
		if (inst.input) {
			inst.input.val (dateStr);
		}
		this._updateAlternate (inst);

		onSelect = this._get (inst, "onSelect");
		if (onSelect) {
			onSelect.apply ((inst.input? inst.input [0]: null), [dateStr, inst]); // aciona o retorno de chamada personalizado
		} else if (inst.input) {
			inst.input.trigger ("mudança"); // dispara o evento de mudança
		}

		if (inst.inline) {
			this._updateDatepicker (inst);
		} outro {
			this._hideDatepicker ();
			this._lastInput = inst.input [0];
			if (typeof (inst.input [0])! == "objeto") {
				inst.input.trigger ("focus"); // restaura o foco
			}
			this._lastInput = null;
		}
	}

	/ * Atualize qualquer campo alternativo para sincronizar com o campo principal. * /
	_updateAlternate: function (inst) {
		var altFormat, date, dateStr,
			altField = this._get (inst, "altField");

		if (altField) {// atualizar campo alternativo também
			altFormat = this._get (inst, "altFormat") || this._get (inst, "dateFormat");
			date = this._getDate (inst);
			dateStr = this.formatDate (altFormat, date, this._getFormatConfig (inst));
			$ (altField) .val (dateStr);
		}
	}

	/ * Defina como função beforeShowDay para impedir a seleção de finais de semana.
	 * @param date Date - a data para personalizar
	 * @return [boolean, string] - esta data é selecionável ?, qual é a classe CSS?
	 * /
	noWeekends: function (date) {
		var day = date.getDay ();
		return [(dia> 0 && dia <6), ""];
	}

	/ * Defina como calculateWeek para determinar a semana do ano com base na definição da ISO 8601.
	 * @param date Date - a data para obter a semana para
	 * @return number - o número da semana dentro do ano que contém esta data
	 * /
	iso8601Week: function (date) {
		var tempo,
			checkDate = new Date (date.getTime ());

		// Encontre quinta-feira desta semana a partir de segunda-feira
		checkDate.setDate (checkDate.getDate () + 4 - (checkDate.getDay () || 7));

		time = checkDate.getTime ();
		checkDate.setMonth (0); // Compare com 1 de janeiro
		checkDate.setDate (1);
		retornar Math.floor (Math.round ((time - checkDate) / 86400000) / 7) + 1;
	}

	/ * Analisa um valor de string em um objeto de data.
	 * Veja formatDate abaixo para os possíveis formatos.
	 *
	 * @ string de formato param - o formato esperado da data
	 * @param value string - a data no formato acima
	 * @param settings Object - os atributos incluem:
	 * shortYearCutoff number - o ano de corte para determinar o século (opcional)
	 * string dayNamesShort [7] - nomes abreviados dos dias do domingo (opcional)
	 * dayNames string [7] - nomes dos dias do domingo (opcional)
	 * string monthNamesShort [12] - nomes abreviados dos meses (opcional)
	 * monthNames string [12] - nomes dos meses (opcional)
	 * @return Date - o valor da data extraída ou null se o valor estiver em branco
	 * /
	parseDate: function (format, value, settings) {
		if (format == null || valor == null) {
			lançar "argumentos inválidos";
		}

		value = (tipo de valor === "objeto"? valor.toString (): valor + "");
		if (valor === "") {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = (configurações? settings.shortYearCutoff: null) || this._defaults.shortYearCutoff,
			shortYearCutoff = (tipo de shortYearCutoffTemp! == "string"? shortYearCutoffTemp:
				nova Data (). getFullYear ()% 100 + parseInt (shortYearCutoffTemp, 10)),
			dayNamesShort = (configurações? settings.dayNamesShort: null) || this._defaults.dayNamesShort,
			dayNames = (configurações? settings.dayNames: null) || this._defaults.dayNames,
			monthNamesShort = (configurações? settings.monthNamesShort: null) || this._defaults.monthNamesShort,
			monthNames = (configurações? settings.monthNames: null) || this._defaults.monthNames,
			ano = -1,
			mês = -1
			dia = -1
			doy = -1,
			literal = falso
			encontro,

			// Verifique se um caractere de formato é duplicado
			lookAhead = function (match) {
				var matches = (iFormat + 1 <format.length && format.charAt (iFormat + 1) === correspondência);
				if (correspondências) {
					iFormat ++;
				}
				retornar correspondências;
			}

			// Extrai um número do valor da string
			getNumber = function (match) {
				var isDoubled = lookAhead (correspondência),
					size = (match === "@"? 14: (jogo === "!"? 20:
					(match === "y" && isDoubled? 4: (match === "o"? 3: 2)))),
					minSize = (match === "y"? size: 1),
					digits = new RegExp ("^ \\ d {" + minSize + "," + tamanho + "}"),
					num = valor.substring (iValue) .match (dígitos);
				if (! num) {
					throw "Número em falta na posição" + iValue;
				}
				iValor + = num [0] .comprimento;
				return parseInt (num [0], 10);
			}

			// Extrai um nome do valor da string e converte em um índice
			getName = function (match, shortNames, longNames) {
				var index = -1,
					names = $ .map (lookAhead (correspondência)? longNames: shortNames, função (v, k) {
						return [[k, v]];
					}) .sort (função (a, b) {
						return - (a [1] .comprimento - b [1] .comprimento);
					});

				$ .each (nomes, função (i, par) {
					nome do var = par [1];
					if (value.substr (iValue, name.length) .toLowerCase () === name.toLowerCase ()) {
						índice = par [0];
						iValue + = name.length;
						retorna falso;
					}
				});
				if (index! == -1) {
					índice de retorno + 1;
				} outro {
					throw "Nome desconhecido na posição" + iValue;
				}
			}

			// Confirme se um caracter literal corresponde ao valor da string
			checkLiteral = function () {
				if (value.charAt (iValue)! == format.charAt (iFormat)) {
					lance "literal inesperado na posição" + iValue;
				}
				iValue ++;
			};

		para (iFormat = 0; iFormat <format.length; iFormat ++) {
			if (literal) {
				if (format.charAt (iFormat) === "'" &&! lookAhead ("'")) {
					literal = falso;
				} outro {
					checkLiteral ();
				}
			} outro {
				switch (format.charAt (iFormat)) {
					caso "d":
						dia = getNumber ("d");
						quebrar;
					caso "D":
						getName ("D", dayNamesShort, dayNames);
						quebrar;
					caso "o":
						doy = getNumber ("o");
						quebrar;
					caso "m":
						month = getNumber ("m");
						quebrar;
					caso "M":
						mês = getName ("M", monthNamesShort, monthNames);
						quebrar;
					caso "y":
						year = getNumber ("y");
						quebrar;
					caso "@":
						date = new Date (getNumber ("@"));
						year = date.getFullYear ();
						mês = date.getMonth () + 1;
						day = date.getDate ();
						quebrar;
					case "!":
						date = new Date ((getNumber ("!") - this._ticksTo1970) / 10000);
						year = date.getFullYear ();
						mês = date.getMonth () + 1;
						day = date.getDate ();
						quebrar;
					case "'":
						if (lookAhead ("'")) {
							checkLiteral ();
						} outro {
							literal = true;
						}
						quebrar;
					padrão:
						checkLiteral ();
				}
			}
		}

		if (iValue <value.length) {
			extra = value.substr (iValue);
			if (! / ^ \ s + /. test (extra)) {
				throw "Caracteres extras / não pesquisados ​​encontrados na data:" + extra;
			}
		}

		if (ano === -1) {
			ano = novo Date (). getFullYear ();
		} else if (ano <100) {
			ano + = novo Date (). getFullYear () - new Date (). getFullYear ()% 100 +
				(ano <= shortYearCutoff 0: -100);
		}

		if (doy> -1) {
			mês = 1;
			dia = doy;
			Faz {
				dim = this._getDaysInMonth (ano, mês - 1);
				if (dia <= dim) {
					quebrar;
				}
				mês ++;
				dia - = dim;
			} while (true);
		}

		date = this._daylightSavingAdjust (nova data (ano, mês - 1, dia));
		if (date.getFullYear ()! == ano || date.getMonth () + 1! == mês || date.getDate ()! == dia) {
			lançar "data inválida"; // Por exemplo, 31/02/00
		}
		data de retorno;
	}

	/ * Formatos de data padrão. * /
	ATOM: "aa-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "aa-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-My",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "aa-mm-dd", // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor (1970/4) - Math.floor (1970/100) +
		Math.floor (1970/400)) * 24 * 60 * 60 * 10000000),

	/ * Formata um objeto de data em um valor de string.
	 * O formato pode ser combinações dos seguintes:
	 * d - dia do mês (sem primeiro zero)
	 * dd - dia do mês (dois dígitos)
	 * o - dia do ano (sem zeros à esquerda)
	 * oo - dia do ano (três dígitos)
	 * D - nome do dia curto
	 * DD - nome do dia longo
	 * m - mês do ano (sem zero)
	 * mm - mês do ano (dois dígitos)
	 * M - nome do mês curto
	 * MM - nome do mês longo
	 * y - ano (dois dígitos)
	 yy - ano (quatro dígitos)
	 * @ - timestamp Unix (ms desde 01/01/1970)
	 *! - Windows carrapatos (100ns desde 01/01/0001)
	 * "..." - texto literal
	 * '' - citação única
	 *
	 * @param format string - o formato desejado da data
	 * @param date Date - o valor da data para formatar
	 * @param settings Object - os atributos incluem:
	 * string dayNamesShort [7] - nomes abreviados dos dias do domingo (opcional)
	 * dayNames string [7] - nomes dos dias do domingo (opcional)
	 * string monthNamesShort [12] - nomes abreviados dos meses (opcional)
	 * monthNames string [12] - nomes dos meses (opcional)
	 * string @return - a data no formato acima
	 * /
	formatDate: function (format, date, settings) {
		if (! date) {
			Retorna "";
		}

		var iFormat,
			dayNamesShort = (configurações? settings.dayNamesShort: null) || this._defaults.dayNamesShort,
			dayNames = (configurações? settings.dayNames: null) || this._defaults.dayNames,
			monthNamesShort = (configurações? settings.monthNamesShort: null) || this._defaults.monthNamesShort,
			monthNames = (configurações? settings.monthNames: null) || this._defaults.monthNames,

			// Verifique se um caractere de formato é duplicado
			lookAhead = function (match) {
				var matches = (iFormat + 1 <format.length && format.charAt (iFormat + 1) === correspondência);
				if (correspondências) {
					iFormat ++;
				}
				retornar correspondências;
			}

			// Formata um número, com zero à esquerda, se necessário
			formatNumber = function (match, value, len) {
				var num = "" + valor;
				if (lookAhead (correspondência)) {
					while (num.length <len) {
						num = "0" + num;
					}
				}
				return num;
			}

			// Formata um nome, curto ou longo, conforme solicitado
			formatName = function (match, value, shortNames, longNames) {
				return (lookAhead (match)? longNames [valor]: shortNames [valor]);
			}
			saída = "",
			literal = falso;

		if (date) {
			para (iFormat = 0; iFormat <format.length; iFormat ++) {
				if (literal) {
					if (format.charAt (iFormat) === "'" &&! lookAhead ("'")) {
						literal = falso;
					} outro {
						saída + = format.charAt (iFormat);
					}
				} outro {
					switch (format.charAt (iFormat)) {
						caso "d":
							saída + = formatNumber ("d", date.getDate (), 2);
							quebrar;
						caso "D":
							saída + = formatName ("D", date.getDay (), dayNamesShort, dayNames);
							quebrar;
						caso "o":
							saída + = formatNumber ("o",
								Math.round ((nova Data (date.getFullYear (), date.getMonth (), date.getDate ()) .getTime () - nova Data (date.getFullYear (), 0, 0) .getTime ()) / 86400000), 3);
							quebrar;
						caso "m":
							saída + = formatNumber ("m", date.getMonth () + 1, 2);
							quebrar;
						caso "M":
							saída + = formatName ("M", date.getMonth (), monthNamesShort, monthNames);
							quebrar;
						caso "y":
							saída + = (lookAhead ("y")? date.getFullYear ():
								(date.getFullYear ()% 100 <10? "0": "") + date.getFullYear ()% 100);
							quebrar;
						caso "@":
							saída + = data.getTime ();
							quebrar;
						case "!":
							saída + = date.getTime () * 10000 + this._ticksTo1970;
							quebrar;
						case "'":
							if (lookAhead ("'")) {
								saída + = "'";
							} outro {
								literal = true;
							}
							quebrar;
						padrão:
							saída + = format.charAt (iFormat);
					}
				}
			}
		}
		retorno de saída;
	}

	/ * Extrai todos os caracteres possíveis do formato de data. * /
	_possibleChars: function (format) {
		var iFormat,
			chars = "",
			literal = falso

			// Verifique se um caractere de formato é duplicado
			lookAhead = function (match) {
				var matches = (iFormat + 1 <format.length && format.charAt (iFormat + 1) === correspondência);
				if (correspondências) {
					iFormat ++;
				}
				retornar correspondências;
			};

		para (iFormat = 0; iFormat <format.length; iFormat ++) {
			if (literal) {
				if (format.charAt (iFormat) === "'" &&! lookAhead ("'")) {
					literal = falso;
				} outro {
					chars + = format.charAt (iFormat);
				}
			} outro {
				switch (format.charAt (iFormat)) {
					caso "d": caso "m": caso "y": caso "@":
						chars + = "0123456789";
						quebrar;
					caso "D": caso "M":
						return null; // Aceite qualquer coisa
					case "'":
						if (lookAhead ("'")) {
							chars + = "'";
						} outro {
							literal = true;
						}
						quebrar;
					padrão:
						chars + = format.charAt (iFormat);
				}
			}
		}
		retornar caracteres;
	}

	/ * Obtém um valor de configuração, padrão se necessário. * /
	_get: function (inst, name) {
		return inst.settings [name]! == indefinido?
			inst.settings [name]: this._defaults [nome];
	}

	/ * Analisa a data existente e selecionador de data de inicialização. * /
	_setDateFromField: function (inst, noDefault) {
		if (inst.input.val () === inst.lastVal) {
			Retorna;
		}

		var dateFormat = this._get (inst, "dateFormat"),
			datas = inst.lastVal = inst.input? inst.input.val (): null,
			defaultDate = this._getDefaultDate (inst),
			date = defaultDate,
			settings = this._getFormatConfig (inst);

		experimentar {
			date = this.parseDate (dateFormat, datas, configurações) || defaultDate;
		} catch (event) {
			datas = (semDefault? "": datas);
		}
		inst.selectedDay = date.getDate ();
		inst.drawMonth = inst.selectedMonth = date.getMonth ();
		inst.drawYear = inst.selectedYear = date.getFullYear ();
		inst.currentDay = (datas? date.getDate (): 0);
		inst.currentMonth = (datas? date.getMonth (): 0);
		inst.currentYear = (datas? date.getFullYear (): 0);
		this._adjustInstDate (inst);
	}

	/ * Recupera a data padrão mostrada na abertura. * /
	_getDefaultDate: function (inst) {
		return this._restrictMinMax (inst,
			this._determineDate (inst, this._get (inst, "defaultDate"), new Date ()));
	}

	/ * Uma data pode ser especificada como um valor exato ou relativo. * /
	_determineDate: function (inst, date, defaultDate) {
		var offsetNumeric = função (deslocamento) {
				var date = new Data ();
				date.setDate (date.getDate () + offset);
				data de retorno;
			}
			offsetString = função (deslocamento) {
				experimentar {
					return $ .datepicker.parseDate ($ .datepicker._get (inst, "dateFormat"),
						offset, $ .datepicker._getFormatConfig (inst));
				}
				catch (e) {

					// Ignore
				}

				var date = (offset.toLowerCase (). corresponde (/ ^ c /)?
					$ .datepicker._getDate (inst): null) || Nova data(),
					year = date.getFullYear (),
					mês = date.getMonth (),
					day = date.getDate (),
					padrão = / ([+ \ -]? [0-9] +) \ s * (d | D | w | W | m | M | y | Y)? / g,
					correspondências = pattern.exec (deslocamento);

				while (jogos) {
					switch (combinações [2] || "d") {
						caso "d": caso "D":
							dia + = parseInt (corresponde [1], 10); quebrar;
						caso "w": caso "W":
							dia + = parseInt (corresponde a [1], 10) * 7; quebrar;
						caso "m": caso "M":
							mês + = parseInt (correspondências [1], 10);
							dia = Math.min (dia, $ .datepicker._getDaysInMonth (ano, mês));
							quebrar;
						caso "y": caso "Y":
							ano + = parseInt (correspondências [1], 10);
							dia = Math.min (dia, $ .datepicker._getDaysInMonth (ano, mês));
							quebrar;
					}
					correspondências = pattern.exec (deslocamento);
				}
				return new Date (ano, mês, dia);
			}
			newDate = (date == null || date === ""? defaultDate: (tipo de data === "string"? offsetString (data):
				(tipo de data === "número"? (isNaN (data)? defaultDate: offsetNumeric (data)): novo Date (date.getTime ()))));

		newDate = (newDate && newDate.toString () === "Data Inválida"? defaultDate: newDate);
		if (newDate) {
			newDate.setHours (0);
			newDate.setMinutes (0);
			newDate.setSeconds (0);
			newDate.setMilliseconds (0);
		}
		return this._daylightSavingAdjust (newDate);
	}

	/ * Handle mudar para / de horário de verão.
	 * O horário pode ser diferente de zero no corte de horário de verão:
	 *> 12 quando a meia-noite muda, mas não pode gerar
	 * datetime da meia-noite, pule para 1AM, caso contrário, redefina.
	 * @param date (Date) a data para verificar
	 * @return (Date) a data corrigida
	 * /
	_daylightSavingAdjust: function (date) {
		if (! date) {
			return null;
		}
		date.setHours (date.getHours ()> 12? date.getHours () + 2: 0);
		data de retorno;
	}

	/ * Defina a data (s) diretamente. * /
	_setDate: function (inst, date, noChange) {
		var clear =! date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax (inst, this._determineDate (inst, date, new Date ()));

		inst.selectedDay = inst.currentDay = newDate.getDate ();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth ();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear ();
		if ((origMonth! == inst.selectedMonth || origYear! == inst.selectedYear) &&! noChange) {
			this._notifyChange (inst);
		}
		this._adjustInstDate (inst);
		if (inst.input) {
			inst.input.val (clear? "": this._formatDate (inst));
		}
	}

	/ * Recupere a (s) data (s) diretamente. * /
	_getDate: function (inst) {
		var startDate = (! inst.currentYear || (inst.input && inst.input.val () === "")? null:
			this._daylightSavingAdjust (nova data (
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	}

	/ * Anexe os manipuladores onxxx. Estes são declarados estaticamente
	 * Eles trabalham com transformadores de código estático como o Caja.
	 * /
	_attachHandlers: function (inst) {
		var stepMonths = this._get (inst, "stepMonths"),
			id = "#" + inst.id.replace (/ \\\\ / g, "\\");
		inst.dpDiv.find ("[manipulador de dados]") .map (function () {
			var handler = {
				prev: function () {
					$ .datepicker._adjustDate (id, -stepMonths, "M");
				}
				próximo: function () {
					$ .datepicker._adjustDate (id, + stepMonths, "M");
				}
				hide: function () {
					$ .datepicker._hideDatepicker ();
				}
				hoje: function () {
					$ .datepicker._gotoToday (id);
				}
				selectDay: function () {
					$ .datepicker._selectDay (id, + this.getAttribute ("data-month"), + this.getAttribute ("data-ano"), isto);
					retorna falso;
				}
				selectMonth: function () {
					$ .datepicker._selectMonthYear (id, this, "M");
					retorna falso;
				}
				selectYear: function () {
					$ .datepicker._selectMonthYear (id, this, "Y");
					retorna falso;
				}
			};
			$ (this) .on (this.getAttribute ("data-event"), manipulador [this.getAttribute ("manipulador de dados")]);
		});
	}

	/ * Gerar o HTML para o estado atual do selecionador de data. * /
	_generateHTML: function (inst) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controles, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, linha, grupo, col, selectedDate,
			cornerClass, calandre, thead, dia, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, não selecionável,
			tempDate = new Date (),
			today = this._daylightSavingAdjust (
				nova data (tempDate.getFullYear (), tempDate.getMonth (), tempDate.getDate ())), // tempo de limpeza
			isRTL = this._get (inst, "isRTL"),
			showButtonPanel = this._get (inst, "showButtonPanel"),
			hideIfNoPrevNext = this._get (inst, "hideIfNoPrevNext"),
			navigationAsDateFormat = this._get (inst, "navigationAsDateFormat"),
			numMonths = this._getNumberOfMonths (inst),
			showCurrentAtPos = this._get (inst, "showCurrentAtPos"),
			stepMonths = this._get (inst, "stepMonths"),
			isMultiMonth = (numMonths [0]! == 1 || numMonths [1]! == 1),
			currentDate = this._daylightSavingAdjust ((! inst.currentDay? new Date (9999, 9, 9):
				nova data (inst.currentYear, inst.currentMonth, inst.currentDay))),
			minDate = this._getMinMaxDate (inst, "min"),
			maxDate = this._getMinMaxDate (inst, "max"),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if (drawMonth <0) {
			drawMonth + = 12;
			drawYear--;
		}
		if (maxDate) {
			maxDraw = this._daylightSavingAdjust (nova data (maxDate.getFullYear (),
				maxDate.getMonth () - (numMonths [0] * numMonths [1]) + 1, maxDate.getDate ()));
			maxDraw = (minDate && maxDraw <minDate? minDate: maxDraw);
			while (this._daylightSavingAdjust (nova data (drawYear, drawMonth, 1))> maxDraw) {
				drawMonth--;
				if (drawMonth <0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get (inst, "prevText");
		prevText = (! navigationAsDateFormat? prevText: this.formatDate (prevText,
			this._daylightSavingAdjust (nova data (drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig (inst)));

		prev = (this._canAdjustMonth (inst, -1, drawYear, drawMonth)?
			"<-class = 'ui-datepicker-prev ui-corner-all' manipulador de dados = 'anterior' data-evento = 'clique'" +
			"title = '" + prevText + "'> <span class = 'ui-ícone ui-ícone-círculo-triângulo-" + (isRTL? "e": "w") + "'>" + prevText + "< / span> </a> ":
			(hideIfNoPrevNext? "": "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'> <span class = 'ui-ícone ui-icon- círculo-triângulo- "+ (isRTL?" e ":" w ") +" '> "+ prevText +" </ span> </a> "));

		nextText = this._get (inst, "nextText");
		nextText = (! navigationAsDateFormat? nextText: this.formatDate (nextText,
			this._daylightSavingAdjust (nova data (drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig (inst)));

		next = (this._canAdjustMonth (inst, +1, drawYear, drawMonth)?
			"<-class = 'ui-datepicker-next ui-corner-all' data-handler = 'próximo' data-evento = 'clique'" +
			"title = '" + nextText + "'> <span class = 'ui-ícone ui-ícone-círculo-triângulo-" + (isRTL? "w": "e") + "'>" + próximoTexto + "< / span> </a> ":
			(hideIfNoPrevNext? "": "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'> <span class = 'ui-ícone ui-icon- círculo-triângulo- "+ (isRTL?" w ":" e ") +" '> "+ nextText +" </ span> </a> "));

		currentText = this._get (inst, "currentText");
		gotoDate = (this._get (inst, "gotoCurrent") && inst.currentDay? currentDate: hoje);
		currentText = (! navigationAsDateFormat? currentText:
			this.formatDate (currentText, gotoDate, this._getFormatConfig (inst)));

		controles = (! inst.inline? "<tipo de botão = 'botão' class = 'ui-datepicker-close ui-estado-padrão ui-prioridade-primária ui-canto-tudo' data-handler = 'ocultar' data-event = 'clique'> "+
			this._get (inst, "closeText") + "</ button>": "");

		buttonPanel = (showButtonPanel)? "<div class = 'ui-datepicker-buttonpane ui-widget-conteúdo'>" + (isRTL? controles: "") +
			(this._isInRange (inst, gotoDate)? "<tipo de botão = 'botão' class = 'ui-datepicker-current ui-estado-padrão ui-prioridade-secundário ui-canto-tudo' data-handler = 'hoje' dados -evento = 'clique' "+
			"+" + currentText + "</ button>": "") + (isRTL? "": controles) + "</ div>": "";

		firstDay = parseInt (this._get (inst, "firstDay"), 10);
		firstDay = (isNaN (firstDay)? 0: firstDay);

		showWeek = this._get (inst, "showWeek");
		dayNames = this._get (inst, "dayNames");
		dayNamesMin = this._get (inst, "dayNamesMin");
		monthNames = this._get (inst, "monthNames");
		monthNamesShort = this._get (inst, "monthNamesShort");
		beforeShowDay = this._get (inst, "beforeShowDay");
		showOtherMonths = this._get (inst, "showOtherMonths");
		selectOtherMonths = this._get (inst, "selectOtherMonths");
		defaultDate = this._getDefaultDate (inst);
		html = "";

		para (linha = 0; linha <numMonths [0]; linha ++) {
			group = "";
			this.maxRows = 4;
			para (col = 0; col <numMonths [1]; col ++) {
				selectedDate = this._daylightSavingAdjust (nova data (drawYear, drawMonth, inst.selectedDay));
				cornerClass = "ui-corner-all";
				calender = "";
				if (isMultiMonth) {
					calendário + = "<div class = 'ui-datepicker-group";
					if (numMonths [1]> 1) {
						interruptor (col) {
							case 0: calender + = "ui-datepicker-group-first";
								cornerClass = "ui-corner-" + (isRTL? "right": "left"); quebrar;
							case numMonths [1] - 1: calendário + = "ui-datepicker-group-last";
								cornerClass = "ui-corner-" + (isRTL? "left": "right"); quebrar;
							padrão: calender + = "ui-datepicker-group-middle"; cornerClass = ""; quebrar;
						}
					}
					calendário + = "'>";
				}
				calendário + = "<div classe = 'ui-datepicker-cabeçalho ui-widget-cabeçalho ui-helper-clearfix" + cornerClass + "'>" +
					(/all|left/.test (cornerClass) && row === 0? (isRTL? next: prev): "") +
					(/all|right/.test (cornerClass) && row === 0? (isRTL? prev: next): "") +
					this._generateMonthYearHeader (inst, drawMonth, drawYear, minDate, maxDate,
					linha> 0 || col> 0, monthNames, monthNamesShort) + // extrair cabeçalhos de mês
					"</ div> <table class = 'agendamento-do-calendário-ui'> <thead>" +
					"<tr>";
				thead = (showWeek? "<th classe = 'ui-datepicker-semana-col'>" + this._get (inst, "weekHeader") + "</ th>": "");
				para (dow = 0; dow <7; dow ++) {// dias da semana
					dia = (dow + firstDay)% 7;
					thead + = "<th scope = 'col'" + ((dow + primeiroDay + 6)% 7> = 5? "class = 'ui-datepicker-week-end'": "") + ">" +
						"<span title =" "+ dayNames [dia] +" '> "+ diaNamesMin [dia] +" </ span> </ th> ";
				}
				calender + = thead + "</ tr> </ thead> <tbody>";
				daysInMonth = this._getDaysInMonth (drawYear, drawMonth);
				if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
					inst.selectedDay = Math.min (inst.selectedDay, daysInMonth);
				}
				leadDays = (this._getFirstDayOfMonth (drawYear, drawMonth) - primeiroDia + 7)% 7;
				curRows = Math.ceil ((leadDays + daysInMonth) / 7); // calcula o número de linhas para gerar
				numRows = (isMultiMonth? this.maxRows> curRows? this.maxRows: curvas: curvas); // Se vários meses, use o maior número de linhas (veja # 7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust (nova Data (drawYear, drawMonth, 1 - leadDays));
				para (dRow = 0; dRow <numRows; dRow ++) {// criar linhas do selecionador de data
					calendário + = "<tr>";
					tbody = (! showWeek? "": "<td classe = 'ui-datepicker-semana-col'>" +
						this._get (inst, "calculateWeek") (printDate) + "</ td>");
					para (dow = 0; dow <7; dow ++) {// criar dias do selecionador de data
						daySettings = (beforeShowDay?
							beforeShowDay.apply ((inst.input? inst.input [0]: null), [printDate]): [verdadeiro, ""]);
						otherMonth = (printDate.getMonth ()! == drawMonth);
						unselectable = (otherMonth &&! selectOtherMonths) || ! daySettings [0] ||
							(minDate && printDate <minDate) || (maxDate && printDate> maxDate);
						tbody + = "<td class = '" +
							((dow + firstDay + 6)% 7> = 5? "ui-datepicker-week-end": "") + // destaque finais de semana
							(otherMonth? "ui-datepicker-other-month": "") + // destaque dias de outros meses
							((printDate.getTime () === selectedDate.getTime () && drawMonth === inst.selectedMonth && inst._keyEvent) || // tecla pressionada pelo usuário
							(defaultDate.getTime () === printDate.getTime () && defaultDate.getTime () === selectedDate.getTime ())?

							// ou a data padrão é a data impressa atual e a data padrão é a data selecionada
							"" + this._dayOverClass: "") + // destaque dia selecionado
							(não selecionável? "" + this._unselectableClass + "ui-state-disabled": "") + // realce dias não selecionáveis
							(otherMonth &&! showOtherMonths? "": "" + daySettings [1] + // destaque datas personalizadas
							(printDate.getTime () === currentDate.getTime ()? "" + this._currentClass: "") + // destaque dia selecionado
							(printDate.getTime () === today.getTime ()? "ui-datepicker-today": "")) + "'" + // destaque hoje (se diferente)
							((! otherMonth || showOtherMonths) && daySettings [2]? "title = '" + daySettings [2] .replace (/' / g, "& # 39;") + "'": "") + // título da célula
							(não selecionável? ":" data-handler = 'selectDay' data-event = 'clique' data-mês = '"+ printDate.getMonth () +"' data-ano = '"+ printDate.getFullYear () +" '") +"> "+ // ações
							(otherMonth &&! showOtherMonths? "& # xa0;": // exibição para outros meses
							(não selecionável? "<span class = 'ui-estado-padrão'>" + printDate.getDate () + "</ span>": "<uma classe = 'ui-estado-padrão" +
							(printDate.getTime () === today.getTime ()? "ui-state-highlight": "") +
							(printDate.getTime () === currentDate.getTime ()? "ui-state-active": "") + // destaque dia selecionado
							(otherMonth? "ui-priority-secondary": "") + // distingue datas de outros meses
							"'href =' # '>" + printDate.getDate () + "</a>")) + "</ td>"; // exibe a data selecionável
						printDate.setDate (printDate.getDate () + 1);
						printDate = this._daylightSavingAdjust (printDate);
					}
					calender + = tbody + "</ tr>";
				}
				drawMonth ++;
				if (drawMonth> 11) {
					drawMonth = 0;
					drawYear ++;
				}
				calendário + = "</ tbody> </ table>" + (isMultiMonth? "</ div>" +
							((numMonths [0]> 0 && col === numMonths [1] - 1)? "<div classe = 'ui-datepicker-row-break'> </ div>": ""): "");
				grupo + = calendário;
			}
			html + = group;
		}
		html + = buttonPanel;
		inst._keyEvent = false;
		return html;
	}

	/ * Gerar o cabeçalho do mês e ano. * /
	_generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
			secundário, monthNames, monthNamesShort) {

		var inMinYear, inMaxYear, mês, anos, thisYear, determineYear, year, endYear,
			changeMonth = this._get (inst, "changeMonth"),
			changeYear = this._get (inst, "changeYear"),
			showMonthAfterYear = this._get (inst, "showMonthAfterYear"),
			html = "<div class = 'ui-datepicker-title'>",
			monthHtml = "";

		// Seleção do mês
		if (secundário ||! changeMonth) {
			monthHtml + = "<span class = 'ui-datepicker-month'>" + mesesNomes [drawMonth] + "</ span>";
		} outro {
			inMinYear = (minDate && minDate.getFullYear () === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear () === drawYear);
			monthHtml + = "<selecione class = 'ui-datepicker-month' manipulador de dados = 'selectMonth' data-event = 'change'>";
			para (mês = 0; mês <12; mês ++) {
				if ((! inMinYear || mês> = minDate.getMonth ()) && (! inMaxYear || mês <= maxDate.getMonth ())) {
					monthHtml + = "<valor da opção = '" + mês + "'" +
						(mês === drawMonth? "selected = 'selected'": "") +
						"+" monthNamesShort [mês] + "</ option>";
				}
			}
			monthHtml + = "</ select>";
		}

		if (! showMonthAfterYear) {
			html + = monthHtml + (secundário ||! (changeMonth && changeYear)? "& # xa0;": "");
		}

		// Seleção do ano
		if (! inst.yearshtml) {
			inst.yearshtml = "";
			if (secundário ||! changeYear) {
				html + = "<span class = 'ui-datepicker-year'>" + desenharAno + "</ span>";
			} outro {

				// determine o intervalo de anos para exibir
				years = this._get (inst, "yearRange") .split (":");
				thisYear = new Date (). getFullYear ();
				determineYear = function (value) {
					var year = (value.match (/c[+\-].*/)? drawYear + parseInt (valor.substring (1), 10):
						(value.match (/[+\-].*/)? thisYear + parseInt (valor, 10):
						parseInt (valor, 10)));
					retorno (isNaN (ano)? thisAno: ano);
				};
				ano = determineYear (anos [0]);
				endYear = Math.max (year, determineYear (anos [1] || ""));
				ano = (minDate? Math.max (ano, minDate.getFullYear ()): ano);
				endYear = (maxDate? Math.min (endYear, maxDate.getFullYear ()): endYear);
				inst.yearshtml + = "<selecione class = 'ui-datepicker-year' manipulador de dados = 'selectYear' data-event = 'change'>";
				para (; year <= endYear; year ++) {
					inst.yearshtml + = "<valor da opção = '" + ano + "'" +
						(ano === drawYear? "selecionado = 'selecionado'": "") +
						"+" + ano + "</ option>";
				}
				inst.yearshtml + = "</ select>";

				html + = inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html + = this._get (inst, "yearSuffix");
		if (showMonthAfterYear) {
			html + = (secundário ||! (changeMonth && changeYear)? "& # xa0;": "") + monthHtml;
		}
		html + = "</ div>"; // Fechar datepicker_header
		return html;
	}

	/ * Ajustar um dos sub-campos de data. * /
	_adjustInstDate: function (inst, offset, period) {
		var ano = inst.selectedYear + (período === "Y"? deslocamento: 0),
			mês = inst.selectedMonth + (período === "M"? deslocamento: 0),
			dia = Math.min (inst.selectedDay, th is._getDaysInMonth (ano, mês)) + (período === "D"? deslocamento: 0),
			date = this._restrictMinMax (inst, this._daylightSavingAdjust (nova data (ano, mês, dia)));

		inst.selectedDay = date.getDate ();
		inst.drawMonth = inst.selectedMonth = date.getMonth ();
		inst.drawYear = inst.selectedYear = date.getFullYear ();
		if (period === "M" || period === "Y") {
			this._notifyChange (inst);
		}
	}

	/ * Assegure-se de que uma data esteja dentro de qualquer limite mínimo / máximo. * /
	_restrictMinMax: function (inst, date) {
		var minDate = this._getMinMaxDate (inst, "min"),
			maxDate = this._getMinMaxDate (inst, "max"),
			newDate = (minDate && date <minDate? minDate: date);
		return (maxDate && newDate> maxDate? maxDate: newDate);
	}

	/ * Notifica a alteração do mês / ano. * /
	_notifyChange: function (inst) {
		var onChange = this._get (inst, "onChangeMonthYear");
		if (onChange) {
			onChange.apply ((inst.input? inst.input [0]: null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
		}
	}

	/ * Determine o número de meses para mostrar. * /
	_getNumberOfMonths: function (inst) {
		var numMonths = this._get (inst, "numberOfMonths");
		return (numMonths == null? [1, 1]: (tipo de numMonths === "number"? [1, numMonths]: numMonths));
	}

	/ * Determine a data máxima atual - certifique-se de que nenhum componente de tempo esteja configurado. * /
	_getMinMaxDate: function (inst, minMax) {
		return this._determineDate (inst, this._get (inst, minMax + "data"), nulo);
	}

	/ * Encontre o número de dias em um determinado mês. * /
	_getDaysInMonth: function (year, month) {
		return 32 - this._daylightSavingAdjust (new Date (ano, mês, 32)) .getDate ();
	}

	/ * Encontre o dia da semana do primeiro de um mês. * /
	_getFirstDayOfMonth: function (year, month) {
		return new Date (ano, mês, 1) .getDay ();
	}

	/ * Determina se devemos permitir uma alteração de exibição do mês "next / prev". * /
	_canAdjustMonth: function (inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths (inst),
			date = this._daylightSavingAdjust (nova data (curYear,
			curMonth + (deslocamento <0? deslocamento: numMonths [0] * numMonths [1]), 1));

		if (deslocamento <0) {
			date.setDate (this._getDaysInMonth (date.getFullYear (), date.getMonth ()));
		}
		return this._isInRange (inst, date);
	}

	/ * A data especificada está no intervalo aceito? * /
	_isInRange: function (inst, date) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate (inst, "min"),
			maxDate = this._getMinMaxDate (inst, "max"),
			minYear = null,
			maxYear = null,
			anos = this._get (inst, "yearRange");
			if (anos) {
				yearSplit = anos.split (":");
				currentYear = new Date (). getFullYear ();
				minYear = parseInt (yearSplit [0], 10);
				maxYear = parseInt (yearSplit [1], 10);
				if (yearSplit [0] .match (/[+\-].*/)) {
					minYear + = currentYear;
				}
				if (yearSplit [1] .match (/[+\-].*/)) {
					maxYear + = currentYear;
				}
			}

		return ((! minDate || date.getTime ()> = minDate.getTime ()) &&
			(! maxDate || date.getTime () <= maxDate.getTime ()) &&
			(! minYear || date.getFullYear ()> = minYear) &&
			(! maxYear || date.getFullYear () <= maxYear));
	}

	/ * Fornece as definições de configuração para formatação / análise. * /
	_getFormatConfig: function (inst) {
		var shortYearCutoff = this._get (inst, "shortYearCutoff");
		shortYearCutoff = (tipo de shortYearCutoff! == "string"? shortYearCutoff:
			new Date (). getFullYear ()% 100 + parseInt (shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get (inst, "dayNamesShort"), dayNames: this._get (inst, "dayNames"),
			monthNamesShort: this._get (inst, "monthNamesShort"), monthNames: this._get (inst, "monthNames")};
	}

	/ * Formata a data indicada para exibição. * /
	_formatDate: function (inst, dia, mês, ano) {
		if (! dia) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (dia? (tipo de dia === "objeto"? dia:
			this._daylightSavingAdjust (new Date (ano, mês, dia))):
			this._daylightSavingAdjust (new Date (inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate (this._get (inst, "dateFormat"), data, this._getFormatConfig (inst));
	}
});

/ *
 * Ligue eventos de passar o tempo para elementos de datepicker.
 * Feito via delegado, então a ligação só ocorre uma vez no tempo de vida do div pai.
 * Global datepicker_instActive, definido por _updateDatepicker permite que os manipuladores encontrem o caminho de volta ao selecionador ativo.
 * /
function datepicker_bindHover (dpDiv) {
	var selector = "botão, .ui-datepicker-prev, .ui-datepicker-próximo, .ui-datepicker-calendar td a";
	return dpDiv.on ("mouseout", seletor, função () {
			$ (this) .removeClass ("ui-state-hover");
			if (this.className.indexOf ("ui-datepicker-prev")! == -1) {
				$ (this) .removeClass ("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf ("ui-datepicker-next")! == -1) {
				$ (this) .removeClass ("ui-datepicker-next-hover");
			}
		})
		.on ("mouseover", seletor, datepicker_handleMouseover);
}

function datepicker_handleMouseover () {
	if (! $. datepicker._isDisabledDatepicker (datepicker_instActive.inline? datepicker_instActive.dpDiv.parent () [0]: datepicker_instActive.input [0])) {
		$ (this) .parents (".-datepicker-calendar") .find ("a") .removeClass ("ui-state-hover");
		$ (this) .addClass ("ui-state-hover");
		if (this.className.indexOf ("ui-datepicker-prev")! == -1) {
			$ (this) .addClass ("ui-datepicker-prev-hover");
		}
		if (this.className.indexOf ("ui-datepicker-next")! == -1) {
			$ (this) .addClass ("ui-datepicker-next-hover");
		}
	}
}

/ * jQuery estender agora ignora nulos! * /
function datepicker_extendRemove (target, props) {
	$ .extend (alvo, adereços);
	para (nome var em adereços) {
		if (props [nome] == nulo) {
			target [name] = adereços [name];
		}
	}
	meta de retorno;
}

/ * Invoque a funcionalidade datepicker.
   @param options string - um comando, opcionalmente seguido por parâmetros adicionais ou
					Object - configurações para anexar nova funcionalidade de criador de data
   @return jQuery object * /
$ .fn.datepicker = function (options) {

	/ * Verificar se uma coleção vazia não foi passada - Correções # 6976 * /
	if (! this.length) {
		devolva isto;
	}

	/ * Inicialize o selecionador de data. * /
	if (! $. datepicker.initialized) {
		$ (document) .on ("mousedown", $ .datepicker._checkExternalClick);
		$ .datepicker.initialized = true;
	}

	/ * Anexa o contêiner principal do datepicker ao corpo, se não existir. * /
	if ($ ("#" + $ .datepicker._mainDivId) .length === 0) {
		$ ("body") .append ($ .datepicker.dpDiv);
	}

	var otherArgs = Array.prototype.slice.call (argumentos, 1);
	if (opções typeof === "string" && (options === "isDisabled" || opções === "getDate" || opções === "widget")) {
		return $ .datepicker ["_" + opções + "Datepicker"].
			apply ($ .datepicker, [this [0]] .concat (otherArgs));
	}
	if (options === "option" && arguments.length === 2 && typeof argumentos [1] === "string") {
		return $ .datepicker ["_" + opções + "Datepicker"].
			apply ($ .datepicker, [this [0]] .concat (otherArgs));
	}
	return this.each (function () {
		opções de typeof === "string"?
			$ .datepicker ["_" + opções + "Datepicker"].
				apply ($ .datepicker, [this] .concat (otherArgs)):
			$ .datepicker._attachDatepicker (isto, opções);
	});
};

$ .datepicker = new Datepicker (); // instância singleton
$ .datepicker.initialized = false;
$ .datepicker.uuid = new Date (). getTime ();
$ .datepicker.version = "1.12.1";

var widgetsDatepicker = $ .datepicker;




// Este arquivo está obsoleto
var ie = $ .ui.ie = !! / msie [\ w.] + /. exec (navigator.userAgent.toLowerCase ());

/ *!
 * jQuery UI Mouse 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Mouse
// >> group: Widgets
// >> description: Abstrata interações baseadas em mouse para auxiliar na criação de certos widgets.
// >> docs: http://api.jqueryui.com/mouse/



var mouseHandled = false;
$ (document) .on ("mouseup", function () {
	mouseHandled = falso;
});

var widgetsMouse = $ .widget ("ui.mouse", {
	versão: "1.12.1",
	opções: {
		cancelar: "input, textarea, button, select, option",
		distância: 1,
		atraso: 0
	}
	_mouseInit: function () {
		var isso = isto;

		this.element
			.on ("mousedown". + this.widgetName, function (event) {
				return that._mouseDown (evento);
			})
			.on ("clique". + this.widgetName, function (event) {
				if (true === $ .data (event.target, that.widgetName + ".preventClickEvent")) {
					$ .removeData (event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation ();
					retorna falso;
				}
			});

		this.started = falso;
	}

	// TODO: certifique-se de que destruir uma instância do mouse não atrapalha
	// outras instâncias do mouse
	_mouseDestroy: function () {
		this.element.off ("." + this.widgetName);
		if (this._mouseMelegelate) {
			esse documento
				.off ("mousemove". + this.widgetName, this._mouseMoveDelegate)
				.off ("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	}

	_mouseDown: function (event) {

		// não deixe mais de um widget manipular mouseStart
		if (mouseHandled) {
			Retorna;
		}

		this._mouseMoved = false;

		// Podemos ter perdido o mouseup (fora da janela)
		(this._mouseStarted && this._mouseUp (event));

		this._mouseDownEvent = event;

		var isso = isso,
			btnIsLeft = (event.which === 1),

			// event.target.nodeName trabalha em torno de um bug no IE 8 com
			// entradas desativadas (# 7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName?
				$ (event.target) .closest (this.options.cancel) .length: false);
		if (! btnIsLeft || elIsCancel ||! this._mouseCapture (event)) {
			retorno verdadeiro;
		}

		this.mouseDelayMet =! this.options.delay;
		if (! this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout (function () {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet (event) && this._mouseDelayMet (event)) {
			this._mouseStarted = (this._mouseStart (event)! == false);
			if (! this._mouseStarted) {
				event.preventDefault ();
				retorno verdadeiro;
			}
		}

		// O evento Click nunca pode ter sido disparado (Gecko & Opera)
		if (true === $ .data (event.target, this.widgetName + ".preventClickEvent")) {
			$ .removeData (event.target, this.widgetName + ".preventClickEvent");
		}

		// Estes delegados são obrigados a manter o contexto
		this._mouseMelegelate = function (event) {
			return that._mouseMove (event);
		};
		this._mouseUpDelegate = function (event) {
			return that._mouseUp (evento);
		};

		esse documento
			.on ("mousemove". + this.widgetName, this._mouseMoveDelegate)
			.on ("mouseup." + this.widgetName, this._mouseUpDelegate);

		event.preventDefault ();

		mouseHandled = true;
		retorno verdadeiro;
	}

	_mouseMove: function (event) {

		// Somente verifique se há mouseups fora do documento se você se moveu dentro do documento
		// pelo menos uma vez. Isso evita o disparo do mouseup no caso do IE <9, que será
		// dispara um evento mousemove se o conteúdo for colocado sob o cursor. Veja # 7778
		// Suporte: IE <9
		if (this._mouseMoved) {

			// IE mouseup check - mouseup aconteceu quando o mouse estava fora da janela
			if ($ .ui.ie && (! document.documentMode || document.documentMode <9) &&
					! event.button) {
				return this._mouseUp (evento);

			// Verificação do mouse do iframe - o mouseup ocorreu em outro documento
			} else if (! event.which) {

				// Suporte: Safari <= 8 - 9
				// Safari define qual a 0 se você pressionar qualquer uma das seguintes chaves
				// durante um arrasto (# 14461)
				if (event.originalEvent.altKey || event.originalEvent.ctrlKey ||
						event.originalEvent.metaKey || event.originalEvent.shiftKey) {
					this.ignoreMissingWhich = true;
				} else if (! this.ignoreMissingWhich) {
					return this._mouseUp (evento);
				}
			}
		}

		if (event.which || event.button) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag (event);
			return event.preventDefault ();
		}

		if (this._mouseDistanceMet (event) && this._mouseDelayMet (event)) {
			this._mouseStarted =
				(this._mouseStart (this._mouseDownEvent, event)! == false);
			(this._mouseStarted? this._mouseDrag (event): this._mouseUp (event));
		}

		return! this._mouseStarted;
	}

	_mouseUp: function (event) {
		esse documento
			.off ("mousemove". + this.widgetName, this._mouseMoveDelegate)
			.off ("mouseup." + this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$ .data (event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop (evento);
		}

		if (this._mouseDelayTimer) {
			clearTimeout (this._mouseDelayTimer);
			delete this._mouseDelayTimer;
		}

		this.ignoreMissingWhich = false;
		mouseHandled = falso;
		event.preventDefault ();
	}

	_mouseDistanceMet: function (event) {
		retorno (Math.max (
				Math.abs (this._mouseDownEvent.pageX - event.pageX),
				Math.abs (this._mouseDownEvent.pageY - event.pageY)
			)> = this.options.distance
		);
	}

	_mouseDelayMet: function (/ * event * /) {
		return this.mouseDelayMet;
	}

	// Estes são métodos de marcadores de posição, para serem anulados através da extensão do plugin
	_mouseStart: function (/ * event * /) {},
	_mouseDrag: function (/ * event * /) {},
	_mouseStop: function (/ * event * /) {},
	_mouseCapture: function (/ * event * /) {return true; }
});




// $ .ui.plugin está obsoleto. Use extensões $ .widget ().
var plugin = $ .ui.plugin = {
	add: function (module, opção, conjunto) {
		var i,
			proto = $ .ui [módulo] .prototype;
		para (i em conjunto) {
			proto.plugins [i] = proto.plugins [i] || [];
			proto.plugins [i] .push ([opção, definir [i]]);
		}
	}
	chamar: function (instance, name, args, allowDisconnected) {
		var i,
			set = instance.plugins [nome];

		if (! set) {
			Retorna;
		}

		if (! allowDisconnected && (! instance.element [0] .parentNode ||
				instance.element [0] .parentNode.nodeType === 11)) {
			Retorna;
		}

		para (i = 0; i <set.length; i ++) {
			if (instance.options [set [i] [0]]) {
				set [i] [1] .apply (instance.element, args);
			}
		}
	}
};



var safeBlur = $ .ui.safeBlur = function (element) {

	// Suporte: apenas IE9 - 10
	// Se o <body> estiver desfocado, o IE irá mudar de janela, veja # 9420
	if (element && element.nodeName.toLowerCase ()! == "corpo") {
		$ (elemento) .trigger ("desfoque");
	}
};


/ *!
 * jQuery UI Draggable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: arrastável
// >> group: Interações
// >> description: Permite a funcionalidade de arrastar para qualquer elemento.
// >> docs: http://api.jqueryui.com/draggable/
// >> demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css



$ .widget ("ui.draggable", $ .ui.mouse, {
	versão: "1.12.1",
	widgetEventPrefix: "arrastar",
	opções: {
		addClasses: true
		appendTo: "pai",
		eixo: falso
		connectToSortable: false,
		confinamento: falso,
		cursor: "auto",
		cursorAt: false,
		grade: falso
		handle: false,
		ajudante: "original",
		iframeFix: false,
		opacidade: falso,
		refreshPositions: false,
		reverter: falso
		revertDuration: 500,
		escopo: "padrão",
		deslocamento: verdadeiro
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: falso,
		snapMode: "ambos",
		snapTolerance: 20,
		pilha: falso
		zIndex: false,

		// Callbacks
		arrastar: nulo
		início: null,
		stop: null
	}
	_create: function () {

		if (this.options.helper === "original") {
			this._setPositionRelative ();
		}
		if (this.options.addClasses) {
			this._addClass ("ui-arrastável");
		}
		this._setHandleClassName ();

		this._mouseInit ();
	}

	_setOption: function (key, value) {
		this._super (chave, valor);
		if (chave === "manipular") {
			this._removeHandleClassName ();
			this._setHandleClassName ();
		}
	}

	_destroy: function () {
		if ((this.helper || this.element) .is ("arrastar-arrastar-arrastável")) {
			this.destroyOnClear = true;
			Retorna;
		}
		this._removeHandleClassName ();
		this._mouseDestroy ();
	}

	_mouseCapture: function (event) {
		var o = this.options;

		// Entre outros, evite um arrasto em um identificador redimensionável
		if (this.helper || o.disabled ||
				$ (event.target) .closest (".ui-redimensionável-handle") .length> 0) {
			retorna falso;
		}

		// Saia se não estivermos em um identificador válido
		this.handle = this._getHandle (evento);
		if (! this.handle) {
			retorna falso;
		}

		this._blurActiveElement (event);

		this._blockFrames (o.iframeFix === true? "iframe": o.iframeFix);

		retorno verdadeiro;

	}

	_blockFrames: function (selector) {
		this.iframeBlocks = this.document.find (selector) .map (function () {
			var iframe = $ (isso);

			return $ ("<div>")
				.css ("position", "absolute")
				.appendTo (iframe.parent ())
				.outerWidth (iframe.outerWidth ())
				.outerHeight (iframe.outerHeight ())
				offset (iframe.offset ()) [0];
		});
	}

	_unblockFrames: function () {
		if (this.iframeBlocks) {
			this.iframeBlocks.remove ();
			exclua this.iframeBlocks;
		}
	}

	_blurActiveElement: function (event) {
		var activeElement = $ .ui.safeActiveElement (this.document [0]),
			target = $ (event.target);

		// Não desfoque se o evento ocorreu em um elemento que está dentro
		// o elemento atualmente focado
		// Veja # 10527, # 12472
		if (target.closest (activeElement) .length) {
			Retorna;
		}

		// Desfocar qualquer elemento que atualmente tenha foco, ver # 4261
		$ .ui.safeBlur (activeElement);
	}

	_mouseStart: function (event) {

		var o = this.options;

		// Cria e anexa o ajudante visível
		this.helper = this._createHelper (evento);

		this._addClass (this.helper, "ui-draggable-dragging");

		// Cache do tamanho do ajudante
		this._cacheHelperProportions ();

		// Se ddmanager for usado para droppables, configure o arrastável global
		if ($ .ui.ddmanager) {
			$ .ui.ddmanager.current = this;
		}

		/ *
		 * - Geração de posição -
		 * Este bloco gera tudo relacionado a posição - é o núcleo de draggables.
		 * /

		// Cache das margens do elemento original
		this._cacheMargins ();

		// Armazena a posição css do ajudante
		this.cssPosition = this.helper.css ("position");
		this.scrollParent = this.helper.scrollParent (true);
		this.offsetParent = this.helper.offsetParent ();
		this.hasFixedAncestor = this.helper.parents (). filter (function () {
				return $ (this) .css ("position") === "fixed";
			}). comprimento> 0;

		// A posição absoluta do elemento na página menos as margens
		this.positionAbs = this.element.offset ();
		this._refreshOffsets (evento);

		// Gere a posição original
		this.originalPosition = this.position = this._generatePosition (event, false);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		// Ajusta o offset do mouse em relação ao helper se "cursorAt" é fornecido
		(o.cursorAt && this._adjustOffsetFromHelper (o.cursorAt));

		// Defina uma contenção, se fornecida nas opções
		this._setContainment ();

		// Acionar evento + retornos de chamada
		if (this._trigger ("start", event) === false) {
			this._clear ();
			retorna falso;
		}

		// Recheie o tamanho do ajudante
		this._cacheHelperProportions ();

		// Prepara os deslocamentos droppable
		if ($ .ui.ddmanager &&! o.dropBehaviour) {
			$ .ui.ddmanager.prepareOffsets (this, event);
		}

		// Execute o arrasto uma vez - isso faz com que o ajudante não fique visível antes de obter
		// posição correta
		this._mouseDrag (event, true);

		// Se o ddmanager for usado para droppables, informe ao gerente que o arrastamento foi iniciado
		// (ver # 5003)
		if ($ .ui.ddmanager) {
			$ .ui.ddmanager.dragStart (este, evento);
		}

		retorno verdadeiro;
	}

	_refreshOffsets: function (event) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			esquerda: this.positionAbs.left - this.margins.left,
			deslocamento: falso
			pai: this._getParentOffset (),
			relative: this._getRelativeOffset ()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	}

	_mouseDrag: function (event, noPropagation) {

		// redefinir quaisquer propriedades necessárias armazenadas em cache (veja # 5009)
		if (this.hasFixedAncestor) {
			this.offset.parent = this._getParentOffset ();
		}

		// Calcular a posição dos ajudantes
		this.position = this._generatePosition (event, true);
		this.positionAbs = this._convertPositionTo ("absolute");

		// Chame plugins e callbacks e use a posição resultante se algo for retornado
		if (! noPropagation) {
			var ui = this._uiHash ();
			if (this._trigger ("arrastar", evento, ui) === false) {
				this._mouseUp (new $ .Event ("mouseup", event));
				retorna falso;
			}
			this.position = ui.position;
		}

		this.helper [0] .style.left = this.position.left + "px";
		this.helper [0] .style.top = this.position.top + "px";

		if ($ .ui.ddmanager) {
			$ .ui.ddmanager.drag (this, event);
		}

		retorna falso;
	}

	_mouseStop: function (event) {

		// Se estivermos usando droppables, informe o gerente sobre a queda
		var isso = isso,
			caiu = falso;
		if ($ .ui.ddmanager &&! this.options.dropBehaviour) {
			caiu = $ .ui.ddmanager.drop (isso, evento);
		}

		// se uma gota vem de fora (um classificável)
		if (this.dropped) {
			caiu = this.dropped;
			this.dropped = falso;
		}

		if ((this.options.revert === "invalid" &&! dropped) ||
				(this.options.revert === "valid" && dropped) ||
				this.options.revert === true || ($ .isFunction (this.options.revert) &&
				this.options.revert.call (this.element, dropado))
		) {
			$ (this.helper) .animate (
				this.originalPosition,
				parseInt (this.options.revertDuration, 10),
				function () {
					if (that._trigger ("stop", event)! == false) {
						that._clear ();
					}
				}
			);
		} outro {
			if (this._trigger ("stop", event)! == false) {
				this._clear ();
			}
		}

		retorna falso;
	}

	_mouseUp: function (event) {
		this._unblockFrames ();

		// Se o ddmanager for usado para droppables, informe ao gerente que o arrasto parou
		// (ver # 5003)
		if ($ .ui.ddmanager) {
			$ .ui.ddmanager.dragStop (isso, evento);
		}

		// Só precisa se concentrar se o evento ocorreu no próprio draggable, veja # 10527
		if (this.handleElement.is (event.target)) {

			// A interação acabou; se o clique resultou em um arrasto
			// enfoca o elemento
			this.element.trigger ("focus");
		}

		return $ .ui.mouse.prototype._mouseUp.call (this, event);
	}

	cancel: function () {

		if (this.helper.is (". arrastar arrastável")) {
			this._mouseUp (new $ .Event ("mouseup", {target: this.element [0]}));
		} outro {
			this._clear ();
		}

		devolva isto;

	}

	_getHandle: function (event) {
		devolve this.options.handle?
			!! $ (event.target) .closest (this.element.find (this.options.handle)) .length:
			verdade;
	}

	_setHandleClassName: function () {
		this.handleElement = this.options.handle?
			this.element.find (this.options.handle): this.element;
		this._addClass (this.handleElement, "ui-draggable-handle");
	}

	_removeHandleClassName: function () {
		this._removeClass (this.handleElement, "ui-draggable-handle");
	}

	_createHelper: function (event) {

		var o = this.options,
			helperIsFunction = $ .isFunction (o.helper),
			helper = helperIsFunction?
				$ (o.helper.apply (this.element [0], [event])):
				(o.helper === "clone"?
					this.element.clone (). removeAttr ("id"):
					this.element);

		if (! helper.parents ("corpo") .comprimento) {
			helper.appendTo ((o.appendTo === "pai"?
				this.element [0] .parentNode:
				o.appendTo));
		}

		// Http://bugs.jqueryui.com/ticket/9446
		// uma função auxiliar pode retornar o elemento original
		// que não foi definido como relativo em _create
		if (helperIsFunction && helper [0] === this.element [0]) {
			this._setPositionRelative ();
		}

		if (helper [0]! == this.element [0] &&
				! (/ (fixo | absoluto) /) .test (helper.css ("position")))) {
			helper.css ("position", "absolute");
		}

		retorno auxiliar;

	}

	_setPositionRelative: function () {
		if (! (/ ^ (?:r | a | f) /) .test (this.element.css ("posição")))) {
			this.element [0] .style.position = "relativo";
		}
	}

	_adjustOffsetFromHelper: function (obj) {
		if (tipo de obj === "string") {
			obj = obj.split ("");
		}
		if ($ .isArray (obj)) {
			obj = {esquerda: + obj [0], topo: + obj [1] || 0};
		}
		if ("left" em obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" em obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" em obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" em obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	}

	_isRootNode: function (element) {
		return (/ (html | body) / i) .test (element.tagName) || elemento === this.document [0];
	}

	_getParentOffset: function () {

		// Obtém o offsetParent e armazena em cache sua posição
		var po = this.offsetParent.offset (),
			document = this.document [0];

		// Este é um caso especial em que precisamos modificar um deslocamento calculado no início, já que o
		// seguinte aconteceu:
		// 1. A posição do ajudante é absoluta, portanto, sua posição é calculada com base no
		// próximo pai posicionado
		// 2. O pai real de deslocamento é um filho do pai de rolagem, e o pai de rolagem não é
		// o documento, o que significa que o pergaminho está incluído no cálculo inicial do
		// offset do pai e nunca recalculado após o arrasto
		if (this.cssPosition === "absolute" && this.scrollParent [0]! == documento &&
				$ .contains (this.scrollParent [0], this.offsetParent [0])) {
			po.left + = this.scrollParent.scrollLeft ();
			po.top + = this.scrollParent.scrollTop ();
		}

		if (this._isRootNode (this.offsetParent [0])) {
			po = {top: 0, esquerda: 0};
		}

		Retorna {
			top: po.top + (parseInt (this.offsetParent.css ("borderTopWidth"), 10) || 0),
			left: po.left + (parseInt (this.offsetParent.css ("borderLeftWidth"), 10) || 0)
		};

	}

	_getRelativeOffset: function () {
		if (this.cssPosition! == "relative") {
			return {top: 0, left: 0};
		}

		var p = this.element.position (),
			scrollIsRootNode = this._isRootNode (this.scrollParent [0]);

		Retorna {
			top: p.top - (parseInt (this.helper.css ("top"), 10) || 0) +
				(! scrollIsRootNode? this.scrollParent.scrollTop (): 0),
			left: p.left - (parseInt (this.helper.css ("esquerda"), 10) || 0) +
				(! scrollIsRootNode? this.scrollParent.scrollLeft (): 0)
		};

	}

	_cacheMargins: function () {
		this.margins = {
			left: (parseInt (this.element.css ("marginLeft"), 10) || 0),
			top: (parseInt (this.element.css ("marginTop"), 10) || 0),
			direita: (parseInt (this.element.css ("marginRight"), 10) || 0),
			bottom: (parseInt (this.element.css ("marginBottom"), 10) || 0)
		};
	}

	_cacheHelperProportions: function () {
		this.helperProportions = {
			width: this.helper.outerWidth (),
			altura: this.helper.outerHeight ()
		};
	}

	_setContainment: function () {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document [0];

		this.relativeContainer = null;

		if (! o.containment) {
			this.containment = nulo;
			Retorna;
		}

		if (o.containment === "janela") {
			this.containment = [
				$ (janela) .scrollLeft () - this.offset.relative.left - this.offset.parent.left,
				$ (janela) .scrollTop () - this.offset.relative.top - this.offset.parent.top,
				$ (janela) .scrollLeft () + $ (janela) .width () -
					this.helperProportions.width - this.margins.left,
				$ (janela) .scrollTop () +
					($ (window) .height () || document.body.parentNode.scrollHeight) -
					this.helperProportions.height - this.margins.top
			];
			Retorna;
		}

		if (o.containment === "document") {
			this.containment = [
				0,
				0,
				$ (document) .width () - this.helperProportions.width - this.margins.left,
				($ (documento) .height () || document.body.parentNode.scrollHeight) -
					this.helperProportions.height - this.margins.top
			];
			Retorna;
		}

		if (o.containment.constructor === Array) {
			este.containment = o.containment;
			Retorna;
		}

		if (o.containment === "pai") {
			o.containment = this.helper [0] .parentNode;
		}

		c = $ (o.containment);
		ce = c [0];

		if (! ce) {
			Retorna;
		}

		isUserScrollable = / (scroll | auto) /. test (c.css ("estouro"));

		this.containment = [
			(parseInt (c.css ("borderLeftWidth"), 10) || 0) +
				(parseInt (c.css ("paddingLeft"), 10) || 0),
			(parseInt (c.css ("borderTopWidth"), 10) || 0) +
				(parseInt (c.css ("paddingTop"), 10) || 0),
			(isUserScrollable? Math.max (ce.scrollWidth, ce.offsetWidth): ce.offsetWidth) -
				(parseInt (c.css ("borderRightWidth"), 10) || 0) -
				(parseInt (c.css ("paddingRight"), 10) || 0) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			(isUserScrollable? Math.max (ce.scrollHeight, ce.offsetHeight): ce.offsetHeight) -
				(parseInt (c.css ("borderBottomWidth"), 10) || 0) -
				(parseInt (c.css ("paddingBottom"), 10) || 0) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	}

	_convertPositionTo: function (d, pos) {

		if (! pos) {
			pos = this.position;
		}

		var mod = d === "absolute"? 1: -1
			scrollIsRootNode = this._isRootNode (this.scrollParent [0]);

		Retorna {
			topo: (

				// A posição absoluta do mouse
				pos.top +

				// Somente para nós posicionados relativos: Deslocamento relativo do elemento para compensar o pai
				this.offset.relative.top * mod +

				// O offset do offsetParent sem fronteiras (offset + border)
				this.offset.parent.top * mod -
				((this.cssPosition === "corrigido"?
					-this.offset.scroll.top:
					(scrollIsRootNode? 0: this.offset.scroll.top)) * mod)
			)
			esquerda: (

				// A posição absoluta do mouse
				pos.left +

				// Somente para nós posicionados relativos: Deslocamento relativo do elemento para compensar o pai
				this.offset.relative.left * mod +

				// O offset do offsetParent sem fronteiras (offset + border)
				this.offset.parent.left * mod -
				((this.cssPosition === "corrigido"?
					-este.offset.scroll.left:
					(scrollIsRootNode? 0: this.offset.scroll.left)) * mod)
			)
		};

	}

	_generatePosition: function (event, constrainPosition) {

		var contenção, co, top, esquerda,
			o = this.options,
			scrollIsRootNode = this._isRootNode (this.scrollParent [0]),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache do pergaminho
		if (! scrollIsRootNode ||! this.offset.scroll) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop (),
				left: this.scrollParent.scrollLeft ()
			};
		}

		/ *
		 * - restrição de posição -
		 * Restringir a posição a um mix de grade, contenção.
		 * /

		// Se ainda não estivermos arrastando, não verificaremos as opções
		if (constrainPosition) {
			if (this.containment) {
				if (this.relativeContainer) {
					co = this.relativeContainer.offset ();
					contenção = [
						este.containment [0] + co.left,
						este.containment [1] + co.top,
						este.containment [2] + co.left,
						este.containment [3] + co.top
					];
				} outro {
					contenção = this.containment;
				}

				if (event.pageX - this.offset.click.left <contenção [0]) {
					pageX = contenção [0] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top <containment [1]) {
					pageY = containment [1] + this.offset.click.top;
				}
				if (event.pageX - this.offset.click.left> confinamento [2]) {
					pageX = contenção [2] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top> confinamento [3]) {
					pageY = containment [3] + this.offset.click.top;
				}
			}

			if (o.grid) {

				// Verifique os elementos da grade configurados como 0 para evitar que o erro dividir por 0, causando a invalidação
				// argumentos no IE (veja o ticket # 6950)
				top = o.grid [1] this.originalPageY + Math.round ((páginaY -
					this.originalPageY) / o.grid [1]) * o.grid [1]: this.originalPageY;
				pageY = contenção? ((top - this.offset.click.top> = confinamento [1] ||
					top - this.offset.click.top> contenção [3])?
						topo :
						((top - this.offset.click.top> = contenção [1])?
							top - o.grid [1]: superior + o.grid [1])): top;

				esquerda = o.grid [0] this.originalPageX +
					Math.round ((pageX - this.originalPageX) / o.grid [0]) * o.grid [0]:
					this.originalPageX;
				pageX = contenção? ((esquerda - this.offset.click.left> = confinamento [0] ||
					left - this.offset.click.left> contenção [2])?
						esquerda :
						((left - this.offset.click.left> = contenção [0])?
							esquerda - o.grid [0]: esquerda + o.grid [0])): esquerda;
			}

			if (o.axis === "y") {
				pageX = this.originalPageX;
			}

			if (o.axis === "x") {
				pageY = this.originalPageY;
			}
		}

		Retorna {
			topo: (

				// A posição absoluta do mouse
				pageY -

				// Click offset (relativo ao elemento)
				this.offset.click.top -

				// Somente para nós posicionados relativos: Deslocamento relativo do elemento para compensar o pai
				this.offset.relative.top -

				// O offset do offsetParent sem fronteiras (offset + border)
				this.offset.parent.top +
				(this.cssPosition === "fixed"?
					-this.offset.scroll.top:
					(scrollIsRootNode? 0: this.offset.scroll.top))
			)
			esquerda: (

				// A posição absoluta do mouse
				pageX -

				// Click offset (relativo ao elemento)
				this.offset.click.left -

				// Somente para nós posicionados relativos: Deslocamento relativo do elemento para compensar o pai
				this.offset.relative.left -

				// O offset do offsetParent sem fronteiras (offset + border)
				this.offset.parent.left +
				(this.cssPosition === "fixed"?
					-este.offset.scroll.left:
					(scrollIsRootNode? 0: this.offset.scroll.left))
			)
		};

	}

	_clear: function () {
		this._removeClass (this.helper, "ui-draggable-dragging");
		if (this.helper [0]! == this.element [0] &&! this.cancelHelperRemoval) {
			this.helper.remove ();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if (this.destroyOnClear) {
			this.destroy ();
		}
	}

	// De agora em diante, em massa - principalmente ajudantes

	_trigger: function (type, event, ui) {
		ui = ui || this._uiHash ();
		$ .ui.plugin.call (isso, tipo, [event, ui, this], true);

		// Posição e deslocamento absolutos (ver # 6884) devem ser recalculados após os plugins
		if (/ ^ (drag | start | stop) /. teste (tipo)) {
			this.positionAbs = this._convertPositionTo ("absolute");
			ui.offset = this.positionAbs;
		}
		return $ .Widget.prototype._trigger.call (isto, tipo, evento, ui);
	}

	plugins: {},

	_uiHash: function () {
		Retorna {
			ajudante: this.helper,
			posição: this.position,
			originalPosition: this.originalPosition,
			deslocamento: this.positionAbs
		};
	}

});

$ .ui.plugin.add ("arrastável", "connectToSortable", {
	start: function (event, ui, draggable) {
		var uiSortable = $ .extend ({}, ui, {
			item: draggable.element
		});

		draggable.sortables = [];
		$ (draggable.options.connectToSortable) .each (function () {
			var sortable = $ (this) .sortable ("instância");

			if (sortable &&! sortable.options.disabled) {
				draggable.sortables.push (classificável);

				// RefreshPositions é chamado no início de arrastar para atualizar o containerCache
				// que é usado no arrastar. Isso garante que ele seja inicializado e sincronizado
				// com quaisquer alterações que possam ter ocorrido na página desde a inicialização.
				sortable.refreshPositions ();
				sortable._trigger ("ativar", evento, uiSortable);
			}
		});
	}
	stop: function (event, ui, draggable) {
		var uiSortable = $ .extend ({}, ui, {
			item: draggable.element
		});

		draggable.cancelHelperRemoval = false;

		$ .each (draggable.sortables, function () {
			var sortable = isto;

			if (sortable.isOver) {
				sortable.isOver = 0;

				// Permitir que este classificável manipule a remoção do ajudante
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS Para restaurar propriedades no classificável,
				// como isso também lida com revert (# 9675) desde o draggable
				// pode tê-los modificado de maneiras inesperadas (# 8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css ("posição"),
					top: sortable.placeholder.css ("top"),
					left: sortable.placeholder.css ("esquerda")
				};

				sortable._mouseStop (evento);

				// Após o término da ação de arrastar, o classificador deve voltar a usar
				// seu ajudante original, não o auxiliar compartilhado de draggable
				sortable.options.helper = sortable.options._helper;
			} outro {

				// Impede que este Classificável remova o auxiliar.
				// No entanto, não configure o arrastável para remover o ajudante
				// ou como outro Sortable conectado ainda pode manipular a remoção.
				sortable.cancelHelperRemoval = true;

				sortable._trigger ("desativar", evento, uiSortable);
			}
		});
	}
	drag: function (event, ui, arrastável) {
		$ .each (draggable.sortables, function () {
			var innermostIntersecting = false,
				classificável = isto;

			// Copiar variáveis ​​que podem ser usadas com o uso
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if (sortable._intersectsWith (sortable.containerCache)) {
				innermostIntersecting = true;

				$ .each (draggable.sortables, function () {

					// Copiar variáveis ​​que podem ser usadas com o uso
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if (this! == ordenável &&
							this._intersectsWith (this.containerCache) &&
							$ .contains (sortable.element [0], this.element [0])) {
						innermostIntersecting = false;
					}

					retornar innermostIntersecting;
				});
			}

			if (innermostIntersecting) {

				// Se ele cruzar, usamos uma pequena variável isOver e definimos uma vez,
				// para que o material movido seja demitido apenas uma vez.
				if (! sortable.isOver) {
					sortable.isOver = 1;

					// Armazena o pai de draggable no caso de precisarmos reapender a ele mais tarde.
					draggable._parent = ui.helper.parent ();

					sortable.currentItem = ui.helper
						.appendTo (sortable.element)
						.data ("ui-sortable-item", true);

					// Armazena a opção auxiliar para depois restaurá-la
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function () {
						return ui.helper [0];
					};

					// Incendeie os eventos iniciais do classificável com o nosso evento de navegador passado
					// e nosso próprio ajudante (para que não crie um novo)
					event.target = sortable.currentItem [0];
					sortable._mouseCapture (event, true);
					sortable._mouseStart (event, true, true);

					// Como o evento do navegador está muito distante do novo portlet anexado,
					// modificar variáveis ​​necessárias para refletir as mudanças
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left - = draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top - = draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger ("toSortable", evento);

					// Informe arrastável que o ajudante está em uma área para soltar válida
					// usado somente na opção revert para manipular "válido / inválido".
					draggable.dropped = sortable.element;

					// Precisa atualizarPositions de todos os classables no caso em que
					// adicionar a um classificável altera a localização dos outros sortables (# 9675)
					$ .each (draggable.sortables, function () {
						this.refreshPositions ();
					});

					// Hacke para receber / atualizar os retornos de chamada (principalmente)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = arrastável;
				}

				if (sortable.currentItem) {
					sortable._mouseDrag (event);

					// Copie a posição do ordenável porque os arrastáveis ​​podem refletir
					// uma posição relativa, enquanto classificável é sempre absoluta, que o arrastado
					// elemento agora se tornou. (# 8809)
					ui.position = sortable.position;
				}
			} outro {

				// Se não se cruzar com o ordenável e se cruzar antes,
				// falsificamos a parada de arrasto do classificável, mas não removemos
				// o auxiliar usando cancelHelperRemoval.
				if (sortable.isOver) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Chamar mouseStop do sortable acionaria uma reversão,
					// então reverter deve ser temporariamente falso até que mouseStop seja chamado.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger ("out", event, sortable._uiHash (classificável));
					sortable._mouseStop (event, true);

					// Restaurar comportamentos classificáveis ​​modificados
					// quando o draggable entrou na área classificável (# 9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if (sortable.placeholder) {
						sortable.placeholder.remove ();
					}

					// Restaurar e recalcular o deslocamento do draggable considerando o ordenável
					// pode tê-los modificado de formas inesperadas. (# 8809, # 10669)
					ui.helper.appendTo (draggable._parent);
					draggable._refreshOffsets (event);
					ui.position = draggable._generatePosition (event, true);

					draggable._trigger ("fromSortable", evento);

					// Informe arrastável que o ajudante não está mais em uma zona para soltar válida
					draggable.dropped = false;

					// Precisa atualizarPosições de todos os sortables, apenas para remover
					// de um classificável altera a localização de outros classificadores (# 9675)
					$ .each (draggable.sortables, function () {
						this.refreshPositions ();
					});
				}
			}
		});
	}
});

$ .ui.plugin.add ("arrastável", "cursor", {
	start: function (event, ui, instance) {
		var t = $ ("body"),
			o = instance.options;

		if (t.css ("cursor")) {
			o._cursor = t.css ("cursor");
		}
		t.css ("cursor", o.cursor);
	}
	stop: function (event, ui, instance) {
		var o = instance.options;
		if (o._cursor) {
			$ ("body") .css ("cursor", o._cursor);
		}
	}
});

$ .ui.plugin.add ("arrastável", "opacidade", {
	start: function (event, ui, instance) {
		var t = $ (ui.helper),
			o = instance.options;
		if (t.css ("opacidade")) {
			o._opacity = t.css ("opacidade");
		}
		t.css ("opacidade", o.opacidade);
	}
	stop: function (event, ui, instance) {
		var o = instance.options;
		if (o._opacity) {
			$ (ui.helper) .css ("opacidade", o._opacidade);
		}
	}
});

$ .ui.plugin.add ("arrastável", "rolagem", {
	start: function (event, ui, i) {
		if (! i.scrollParentNotHidden) {
			i.scrollParentNotHidden = i.helper.scrollParent (false);
		}

		if (i.scrollParentNotHidden [0]! == i.document [0] &&
				i.scrollParentNotHidden [0] .tagName! == "HTML") {
			i.overflowOffset = i.scrollParentNotHidden.offset ();
		}
	}
	drag: function (event, ui, i) {

		var o = i.options,
			rolado = falso
			scrollParent = i.scrollParentNotHidden [0],
			document = i.document [0];

		if (scrollParent! == documentar && scrollParent.tagName! == "HTML") {
			if (! o.axis || o.axis! == "x") {
				if ((i.overflowOffset.top + scrollParent.offsetHeight) - event.pageY <
						o.scrollSensitivity) {
					scrollParent.scrollTop = rolado = scrollParent.scrollTop + o.scrollSpeed;
				} else if (event.pageY - i.overflowOffset.top <o.scrollSensitivity) {
					scrollParent.scrollTop = rolado = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if (! o.axis || o.axis! == "y") {
				if ((i.overflowOffset.left + scrollParent.offsetWidth) - event.pageX <
						o.scrollSensitivity) {
					scrollParent.scrollLeft = rolado = scrollParent.scrollLeft + o.scrollSpeed;
				} else if (event.pageX - i.overflowOffset.left <o.scrollSensitivity) {
					scrollParent.scrollLeft = rolado = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} outro {

			if (! o.axis || o.axis! == "x") {
				if (event.pageY - $ (documento) .scrollTop () <o.scrollSensitivity) {
					rolado = $ (documento) .scrollTop ($ (document) .scrollTop () - o.scrollSpeed);
				} else if ($ (window) .height () - (event.pageY - $ (documento) .scrollTop ()) <
						o.scrollSensitivity) {
					rolado = $ (documento) .scrollTop ($ (document) .scrollTop () + o.scrollSpeed);
				}
			}

			if (! o.axis || o.axis! == "y") {
				if (event.pageX - $ (documento) .scrollLeft () <o.scrollSensitivity) {
					rolado = $ (documento) .scrollLeft (
						$ (documento) .scrollLeft () - o.scrollSpeed
					);
				} else if ($ (window) .width () - (event.pageX - $ (documento) .scrollLeft ()) <
						o.scrollSensitivity) {
					rolado = $ (documento) .scrollLeft (
						$ (documento) .scrollLeft () + o.scrollSpeed
					);
				}
			}

		}

		if (rolado! == false && $ .ui.ddmanager &&! o.dropBehaviour) {
			$ .ui.ddmanager.prepareOffsets (i, event);
		}

	}
});

$ .ui.plugin.add ("arrastável", "snap", {
	start: function (event, ui, i) {

		var o = i.options;

		i.snapElements = [];

		$ (o.snap.constructor! == String? (o.snap.items || ": data (ui-arrastável)"): o.snap)
			.each (function () {
				var $ t = $ (isso),
					$ o = $ t.offset ();
				if (isso! == i.element [0]) {
					i.snapElements.push ({
						item: isso,
						width: $ t.outerWidth (), altura: $ t.outerHeight (),
						top: $ o.top, esquerda: $ o.left
					});
				}
			});

	}
	drag: function (event, ui, inst) {

		var ts, bs, ls, rs, l, r, t, b, i, primeiro,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		para (i = inst.snapElements.length - 1; i> = 0; i--) {

			l = inst.snapElements [i] .left - inst.margins.left;
			r = l + inst.snapElements [i] .width;
			t = inst.snapElements [i] .top - inst.margins.top;
			b = t + inst.snapElements [i] .height;

			if (x2 <l - d || x1> r + d || y2 <t - d || y1> b + d ||
					! $. contains (inst.snapElements [i] .item.ownerDocument,
					inst.snapElements [i] .item)) {
				if (inst.snapElements [i] .snapping) {
					(inst.options.snap.release &&
						inst.options.snap.release.call (
							inst.element,
							evento,
							$ .extend (inst._uiHash (), {snapItem: inst.snapElements [i] .item})
						));
				}
				inst.snapElements [i] .snapping = false;
				continuar;
			}

			if (o.snapMode! == "inner") {
				ts = Math.abs (t - y2) <= d;
				bs = Math.abs (b - y1) <= d;
				ls = Math.abs (l - x2) <= d;
				rs = Math.abs (r - x1) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo ("relative", {
						top: t - inst.helperProportions.height,
						esquerda: 0
					} ).topo;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo ("relative", {
						top: b,
						esquerda: 0
					} ).topo;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo ("relative", {
						top: 0,
						left: l - inst.helperProportions.width
					} ).esquerda;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo ("relative", {
						top: 0,
						esquerda: r
					} ).esquerda;
				}
			}

			primeiro = (ts || bs || ls || rs);

			if (o.snapMode! == "outer") {
				ts = Math.abs (t - y1) <= d;
				bs = Math.abs (b - y2) <= d;
				ls = Math.abs (l - x1) <= d;
				rs = Math.abs (r - x2) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo ("relative", {
						top: t,
						esquerda: 0
					} ).topo;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo ("relative", {
						top: b - inst.helperProportions.height,
						esquerda: 0
					} ).topo;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo ("relative", {
						top: 0,
						esquerda: l
					} ).esquerda;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo ("relative", {
						top: 0,
						left: r - inst.helperProportions.width
					} ).esquerda;
				}
			}

			if (! inst.snapElements [i] .snapping && (ts || bs || ls || rs || primeiro))} {
				(inst.options.snap.snap &&
					inst.options.snap.snap.call (
						inst.element,
						evento,
						$ .extend (inst._uiHash (), {
							snapItem: inst.snapElements [i] .item
						})));
			}
			inst.snapElements [i] .snapping = (ts || bs || ls || rs || primeiro);

		}

	}
});

$ .ui.plugin.add ("arrastável", "pilha", {
	start: function (event, ui, instance) {
		var min
			o = instance.options,
			group = $ .makeArray ($ (o.stack)) .sort (função (a, b) {
				return (parseInt ($ (a) .css ("zIndex"), 10) || 0) -
					(parseInt ($ (b) .css ("zIndex"), 10) || 0);
			});

		if (! group.length) {retorno; }

		min = parseInt ($ (group [0]) .css ("zIndex"), 10) || 0;
		$ (group) .each (função (i) {
			$ (this) .css ("zIndex", min + i);
		});
		this.css ("zIndex", (min + group.length));
	}
});

$ .ui.plugin.add ("arrastável", "zIndex", {
	start: function (event, ui, instance) {
		var t = $ (ui.helper),
			o = instance.options;

		if (t.css ("zIndex")) {
			o._zIndex = t.css ("zIndex");
		}
		t.css ("zIndex", o.zIndex);
	}
	stop: function (event, ui, instance) {
		var o = instance.options;

		if (o._zIndex) {
			$ (ui.helper) .css ("zIndex", o._zIndex);
		}
	}
});

var widgetsDraggable = $ .ui.draggable;


/ *!
 * jQuery UI redimensionável 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: redimensionável
// >> group: Interações
// >> description: Permite a funcionalidade de redimensionamento para qualquer elemento.
// >> docs: http://api.jqueryui.com/resizable/
// >> demos: http://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css



$ .widget ("ui.resizable", $ .ui.mouse, {
	versão: "1.12.1",
	widgetEventPrefix: "redimensionar",
	opções: {
		tambémResize: false,
		animar: falso,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		auto-ocultar: falso
		classes: {
			"ui-redimensionável-se": "ui-ícone ui-ícone-gripsmall-diagonal-se"
		}
		confinamento: falso,
		fantasma: falso
		grade: falso
		alças: "e, s, se",
		ajudante: falso
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,

		// Veja # 7960
		zIndex: 90,

		// Callbacks
		redimensionar: null,
		início: null,
		stop: null
	}

	_num: function (value) {
		return parseFloat (valor) || 0;
	}

	_isNumber: function (value) {
		return! isNaN (parseFloat (valor));
	}

	_hasScroll: function (el, a) {

		if ($ (el) .css ("estouro") === "oculto") {
			retorna falso;
		}

		var scroll = (a && a === "left")? "scrollLeft": "scrollTop",
			tem = falso;

		if (el [pergaminho]> 0) {
			retorno verdadeiro;
		}

		// TODO: determine quais casos realmente causam isso
		// se o elemento não tiver o conjunto de rolagem, veja se é possível
		// define o pergaminho
		el [pergaminho] = 1;
		tem = (el [scroll]> 0);
		el [pergaminho] = 0;
		retorno tem;
	}

	_create: function () {

		var margens,
			o = this.options,
			isso = isto;
		this._addClass ("ui-redimensionável");

		$ .extend (isto, {
			_aspectRatio: !! (o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animado? o.helper || "ajudante ui-redimensionável": null
		});

		// Envolva o elemento se ele não puder conter nós filhos
		if (this.element [0] .nodeName.match (/ ^ (tela | área de texto | entrada | seleção | botão | img) $ / i)) {

			this.element.wrap (
				$ ("<div class = 'estilo-ui-wrapper' = 'estouro: oculto;'> </ div>") .css ({
					position: this.element.css ("posição"),
					width: this.element.outerWidth (),
					height: this.element.outerHeight (),
					top: this.element.css ("top"),
					left: this.element.css ("esquerda")
				})
			);

			this.element = this.element.parent (). data (
				"ui-redimensionável", this.element.resizable ("instance")
			);

			this.elementIsWrapper = true;

			margens = {
				marginTop: this.originalElement.css ("marginTop"),
				marginRight: this.originalElement.css ("marginRight"),
				marginBottom: this.originalElement.css ("marginBottom"),
				marginLeft: this.originalElement.css ("marginLeft")
			};

			this.element.css (margens);
			this.originalElement.css ("margin", 0);

			// support: Safari
			// Prevenir redimensionar textarea do Safari
			this.originalResizeStyle = this.originalElement.css ("redimensionar");
			this.originalElement.css ("redimensionar", "nenhum");

			this._proportionallyResizeElements.push (this.originalElement.css ({
				posição: "estática",
				zoom: 1,
				display: "bloco"
			}));

			// Suporte: IE9
			// evita salto do IE (define a margem)
			this.originalElement.css (margens);

			this._proportionallyResize ();
		}

		this._setupHandles ();

		if (o.autoHide) {
			$ (this.element)
				.on ("mouseenter", function () {
					if (o.disabled) {
						Retorna;
					}
					that._removeClass ("ui-resizable-autohide");
					that._handles.show ();
				})
				.on ("mouseleave", function () {
					if (o.disabled) {
						Retorna;
					}
					if (! that.resizing) {
						that._addClass ("ui-resizable-autohide");
						that._handles.hide ();
					}
				});
		}

		this._mouseInit ();
	}

	_destroy: function () {

		this._mouseDestroy ();

		envoltório do var,
			_destroy = function (exp) {
				$ (exp)
					.removeData ("redimensionável")
					.removeData ("ui-resizable")
					.off (".resizable")
					.find (".ui-redimensionável-handle")
						.remover();
			};

		// TODO: Desembrulhar na mesma posição do DOM
		if (this.elementIsWrapper) {
			_destroy (this.element);
			wrapper = this.element;
			this.originalElement.css ({
				position: wrapper.css ("posição"),
				width: wrapper.outerWidth (),
				altura: wrapper.outerHeight (),
				top: wrapper.css ("top"),
				left: wrapper.css ("esquerda")
			}) .insertAfter (wrapper);
			wrapper.remove ();
		}

		this.originalElement.css ("redimensionar", this.originalResizeStyle);
		_destroy (this.originalElement);

		devolva isto;
	}

	_setOption: function (key, value) {
		this._super (chave, valor);

		interruptor (chave) {
		caso "alças":
			this._removeHandles ();
			this._setupHandles ();
			quebrar;
		padrão:
			quebrar;
		}
	}

	_setupHandles: function () {
		var o = this.options, identificador, i, n, hname, eixo, que = isto;
		this.handles = o.handles ||
			(! $ (".ui-redimensionável-handle", this.element) .length?
				"e, s, se": {
					n: ".ui-redimensionável-n",
					e: ".ui-resizable-e",
					s: ".ui-redimensionável-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-redimensionável-ne",
					nw: ".ui-redimensionável-nw"
				});

		this._handles = $ ();
		if (this.handles.constructor === String) {

			if (this.handles === "all") {
				this.handles = "n, e, s, w, se, sw, ne, nw";
			}

			n = this.handles.split (",");
			this.handles = {};

			para (i = 0; i <n.length; i ++) {

				handle = $ .trim (n [i]);
				hname = "ui-resizable-" + handle;
				eixo = $ ("<div>");
				this._addClass (axis, "ui-redimensionável-handle" + hname);

				axis.css ({zIndex: o.zIndex});

				this.handles [handle] = ".ui-redimensionável-" + manipulador;
				this.element.append (eixo);
			}

		}

		this._renderAxis = function (target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			para (i in this.handles) {

				if (this.handles [i] .constructor === String) {
					this.handles [i] = this.element.children (this.handles [i]) .primeiro (). show ();
				} else if (this.handles [i] .jquery || this.handles [i] .nodeType) {
					this.handles [i] = $ (this.handles [i]);
					this._on (this.handles [i], {"mousedown": that._mouseDown});
				}

				if (this.elementIsWrapper &&
						this.originalElement [0]
							.nodeName
							.match (/ ^ (textarea | entrada | selecione | botão) $ / i)) {
					axis = $ (this.handles [i], this.element);

					padWrapper = /sw|ne|nw|se|n|s/.test (i)?
						axis.outerHeight ():
						axis.outerWidth ();

					padPos = ["padding",
						/ne|nw|n/.test (i)? "Topo" :
						/se|sw|s/.test (i)? "Inferior" :
						/ ^ e $ / teste (i)? "Direita": "Esquerda"] .join ("");

					target.css (padPos, padWrapper);

					this._proportionallyResize ();
				}

				this._handles = this._handles.add (this.handles [i]);
			}
		};

		// TODO: make renderAxis é uma função protótipo
		this._renderAxis (this.element);

		this._handles = this._handles.add (this.element.find (".ui-redimensionável-handle"));
		this._handles.disableSelection ();

		this._handles.on ("mouseover", function () {
			if (! that.resizing) {
				if (this.className) {
					axis = this.className.match (/ ui-resizable- (se | sw | ne | nw | n | e | s | w) / i);
				}
				that.axis = axis && axis [1]? eixo [1]: "se";
			}
		});

		if (o.autoHide) {
			this._handles.hide ();
			this._addClass ("ui-resizable-autohide");
		}
	}

	_removeHandles: function () {
		this._handles.remove ();
	}

	_mouseCapture: function (event) {
		var i, handle,
			capture = false;

		para (i in this.handles) {
			handle = $ (this.handles [i]) [0];
			if (handle === event.target || $ .contains (identificador, event.target)) {
				capture = true;
			}
		}

		retorno! this.options.disabled && captura;
	}

	_mouseStart: function (event) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy ();

		curleft = this._num (this.helper.css ("esquerda"));
		curtop = this._num (this.helper.css ("top"));

		if (o.containment) {
			curleft + = $ (o.containment) .scrollLeft () || 0;
			curtop + = $ (o.containment) .scrollTop () || 0;
		}

		this.offset = this.helper.offset ();
		this.position = {esquerda: curleft, topo: curtop};

		this.size = this._helper? {
				width: this.helper.width (),
				height: this.helper.height ()
			}: {
				largura: el.width (),
				height: el.height ()
			};

		this.originalSize = this._helper? {
				width: el.outerWidth (),
				altura: el.outerHeight ()
			}: {
				largura: el.width (),
				height: el.height ()
			};

		this.sizeDiff = {
			width: el.outerWidth () - el.width (),
			altura: el.outerHeight () - el.height ()
		};

		this.originalPosition = {esquerda: curleft, top: curtop};
		this.originalMousePosition = {left: event.pageX, top: event.pageY};

		this.aspectRatio = (tipo de o.aspectRatio === "número")?
			o.aspectRatio:
			((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $ (".ui-resizable-" + this.axis) .css ("cursor");
		$ ("body") .css ("cursor", cursor === "auto"? this.axis + "-resize": cursor);

		this._addClass ("ui-resizable-resizing");
		this._propagate ("start", evento);
		retorno verdadeiro;
	}

	_mouseDrag: function (event) {

		var dados, adereços,
			smp = this.originalMousePosition,
			a = this.axis,
			dx = (event.pageX - smp.left) || 0,
			dy = (event.pageY - smp.top) || 0,
			trigger = this._change [a];

		this._updatePrevProperties ();

		if (! trigger) {
			retorna falso;
		}

		data = trigger.apply (isto, [evento, dx, dy]);

		this._updateVirtualBoundaries (event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio (data, event);
		}

		data = this._respectSize (data, event);

		this._updateCache (data);

		this._propagate ("redimensionar", evento);

		props = this._applyChanges ();

		if (! this._helper && this._proportionallyResizeElements.length) {
			this._proportionallyResize ();
		}

		if (! $. isEmptyObject (props)) {
			this._updatePrevProperties ();
			this._trigger ("redimensionar", evento, this.ui ());
			this._applyChanges ();
		}

		retorna falso;
	}

	_mouseStop: function (event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, esquerda, superior,
			o = this.options, isso = isto;

		if (this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/ textarea / i) .test (pr [0] .nodeName);
			soffseth = ista && this._hasScroll (pr [0], "left")? 0: that.sizeDiff.height;
			soffsetw = ista? 0: that.sizeDiff.width;

			s = {
				width: (this.helper.width () - soffsetw),
				height: (isso.helper.height () - soffseth)
			};
			left = (parseFloat (that.element.css ("left")) +
				(that.position.left - that.originalPosition.left)) || nulo;
			top = (parseFloat (that.element.css ("top")) +
				(that.position.top - that.originalPosition.top)) || nulo;

			if (! o.animate) {
				this.element.css ($ .extend (s, {top: superior, esquerda: esquerda}));
			}

			that.helper.height (that.size.height);
			that.helper.width (that.size.width);

			if (this._helper &&! o.animate) {
				this._proportionallyResize ();
			}
		}

		$ ("body") .css ("cursor", "auto");

		this._removeClass ("ui-resizable-resizing");

		this._propagate ("stop", evento);

		if (this._helper) {
			this.helper.remove ();
		}

		retorna falso;

	}

	_updatePrevProperties: function () {
		this.prevPosition = {
			top: this.position.top,
			esquerda: this.position.left
		};
		this.prevSize = {
			width: this.size.width,
			altura: this.size.height
		};
	}

	_applyChanges: function () {
		var props = {};

		if (this.position.top! == this.prevPosition.top) {
			props.top = this.position.top + "px";
		}
		if (this.position.left! == this.prevPosition.left) {
			props.left = this.position.left + "px";
		}
		if (this.size.width! == this.prevSize.width) {
			props.width = this.size.width + "px";
		}
		if (this.size.height! == this.prevSize.height) {
			props.height = this.size.height + "px";
		}

		this.helper.css (props);

		retornar adereços;
	}

	_updateVirtualBoundaries: function (forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: this._isNumber (o.minWidth)? o.minWidth: 0,
			maxWidth: this._isNumber (o.maxWidth)? o.maxWidth: Infinity,
			minHeight: this._isNumber (o.minHeight)? o.minHeight: 0,
			maxHeight: this._isNumber (o.maxHeight)? o.maxHeight: Infinity
		};

		if (this._aspectRatio || forceAspectRatio) {
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if (pMinWidth> b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if (pMinHeight> b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if (pMaxWidth <b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if (pMaxHeight <b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	}

	_updateCache: function (data) {
		this.offset = this.helper.offset ();
		if (this._isNumber (data.left)) {
			this.position.left = data.left;
		}
		if (this._isNumber (data.top)) {
			this.position.top = data.top;
		}
		if (this._isNumber (data.height)) {
			this.size.height = data.height;
		}
		if (this._isNumber (data.width)) {
			this.size.width = data.width;
		}
	}

	_updateRatio: function (data) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (this._isNumber (data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (this._isNumber (data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		dados de retorno;
	}

	_respectSize: function (data) {

		var o = this._vGráficos,
			a = this.axis,
			ismaxw = this._isNumber (data.width) && o.maxWidth && (o.maxWidth <data.width),
			ismaxh = this._isNumber (data.height) && o.maxHeight && (o.maxHeight <data.height),
			isminw = this._isNumber (data.width) && o.minWidth && (o.minWidth> data.width),
			isminh = this._isNumber (data.height) && o.minHeight && (o.minHeight> data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.originalPosition.top + this.originalSize.height,
			cw = /sw|nw|w/.test (a), ch = /nw|ne|n/.test (a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// Corrigindo erro de salto no topo / esquerda - bug # 2330
		if (! data.width &&! data.height &&! data.left && data.top) {
			data.top = null;
		} else if (! data.width &&! data.height &&! data.top && data.left) {
			data.left = null;
		}

		dados de retorno;
	}

	_getPaddingPlusBorderDimensions: function (element) {
		var i = 0,
			larguras = []
			borders = [
				element.css ("borderTopWidth"),
				element.css ("borderRightWidth"),
				element.css ("borderBottomWidth"),
				element.css ("borderLeftWidth")
			]
			almofadas = [
				element.css ("paddingTop"),
				element.css ("paddingRight"),
				element.css ("paddingBottom"),
				element.css ("paddingLeft")
			];

		para (; i <4; i ++) {
			widths [i] = (parseFloat (bordas [i]) || 0);
			larguras [i] + = (parseFloat (preenchimentos [i]) || 0);
		}

		Retorna {
			altura: larguras [0] + larguras [2],
			largura: larguras [1] + larguras [3]
		};
	}

	_proportionallyResize: function () {

		if (! this._proportionallyResizeElements.length) {
			Retorna;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		para (; i <this._proportionallyResizeElements.length; i ++) {

			prel = this._proportionallyResizeElements [i];

			// TODO: Parece um bug para armazenar em cache this.outerDimensions
			// considerando que estamos em um loop.
			if (! this.outerDimensions) {
				this.outerDimensions = this._getPaddingPlusBorderDimensions (prel);
			}

			prel.css ({
				height: (element.height () - this.outerDimensions.height) || 0,
				width: (element.width () - this.outerDimensions.width) || 0
			});

		}

	}

	_renderProxy: function () {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset ();

		if (this._helper) {

			this.helper = this.helper || $ ("<div style = 'estouro: oculto;'> </ div>");

			this._addClass (this.helper, this._helper);
			this.helper.css ({
				width: this.element.outerWidth (),
				height: this.element.outerHeight (),
				posição: "absoluto",
				esquerda: this.elementOffset.left + "px",
				top: this.elementOffset.top + "px",
				zIndex: ++ o.zIndex // TODO: Não modifique a opção
			});

			this.helper
				.appendTo ("body")
				.disableSelection ();

		} outro {
			this.helper = this.element;
		}

	}

	_mudança: {
		e: function (event, dx) {
			return {width: this.originalSize.width + dx};
		}
		w: function (event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return {left: sp.left + dx, largura: cs.width - dx};
		}
		n: function (event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return {top: sp.top + dy, height: cs.height - dy};
		}
		s: function (event, dx, dy) {
			return {height: this.originalSize.height + dy};
		}
		se: function (event, dx, dy) {
			return $ .extend (this._change.s.apply (isto, argumentos),
				this._change.e.apply (this, [event, dx, dy]));
		}
		sw: function (event, dx, dy) {
			return $ .extend (this._change.s.apply (isto, argumentos),
				this._change.w.apply (isto, [evento, dx, dy]));
		}
		ne: function (event, dx, dy) {
			return $ .extend (this._change.n.apply (isto, argumentos),
				this._change.e.apply (this, [event, dx, dy]));
		}
		nw: function (event, dx, dy) {
			return $ .extend (this._change.n.apply (isto, argumentos),
				this._change.w.apply (isto, [evento, dx, dy]));
		}
	}

	_propagate: function (n, event) {
		$ .ui.plugin.call (this, n, [event, this.ui ()]);
		(n! == "redimensionar" && this._trigger (n, evento, this.ui ()));
	}

	plugins: {},

	ui: function () {
		Retorna {
			originalElement: this.originalElement,
			elemento: this.element,
			ajudante: this.helper,
			posição: this.position,
			tamanho: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/ *
 * Extensões redimensionáveis
 * /

$ .ui.plugin.add ("redimensionável", "animar", {

	stop: function (event) {
		var que = $ (this) .resizable ("instance"),
			o = que.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/ textarea / i) .test (pr [0] .nodeName),
			soffseth = ista && that._hasScroll (pr [0], "left")? 0: that.sizeDiff.height,
			soffsetw = ista? 0: that.sizeDiff.width,
			style = {
				width: (that.size.width - soffsetw),
				altura: (that.size.height - soffseth)
			}
			left = (parseFloat (that.element.css ("left")) +
				(that.position.left - that.originalPosition.left)) || nulo,
			top = (parseFloat (that.element.css ("top")) +
				(that.position.top - that.originalPosition.top)) || nulo;

		that.element.animate (
			$ .extend (style, top && left? {top: superior, esquerda: esquerda}: {}), {
				duração: o.animateDuration,
				easing: o.animateEasing,
				step: function () {

					var data = {
						width: parseFloat (that.element.css ("width")),
						height: parseFloat (that.element.css ("height")),
						top: parseFloat (that.element.css ("top")),
						left: parseFloat (that.element.css ("esquerda"))
					};

					if (pr && pr.length) {
						$ (pr [0]) .css ({largura: data.width, altura: data.height});
					}

					// Propagando redimensionar e atualizar valores para cada etapa de animação
					that._updateCache (data);
					that._propagate ("redimensionar", evento);

				}
			}
		);
	}

});

$ .ui.plugin.add ("redimensionável", "contenção", {

	start: function () {
		elemento var, p, co, ch, cw, largura, altura,
			that = $ (this) .resizable ("instance"),
			o = que.options,
			el = that.element,
			oc.containment,
			ce = (oc instanceof $)?
				oc.get (0):
				(/parent/.test (oc))? el.parent (). get (0): oc;

		if (! ce) {
			Retorna;
		}

		that.containerElement = $ (ce);

		if (/document/.test (oc) || ​​oc === document) {
			that.containerOffset = {
				esquerda: 0,
				top: 0
			};
			that.containerPosition = {
				esquerda: 0,
				top: 0
			};

			that.parentData = {
				elemento: $ (documento),
				esquerda: 0,
				top: 0,
				largura: $ (documento) .width (),
				height: $ (document) .height () || document.body.parentNode.scrollHeight
			};
		} outro {
			elemento = $ (ce);
			p = [];
			$ (["Top", "Direita", "Esquerda", "Inferior"]) .each (function (i, name) {
				p [i] = that._num (element.css ("preenchimento" + nome));
			});

			that.containerOffset = element.offset ();
			that.containerPosition = element.position ();
			that.containerSize = {
				height: (element.innerHeight () - p [3]),
				width: (element.innerWidth () - p [1])
			};

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = (that._hasScroll (ce, "left")? ce.scrollWidth: cw);
			height = (that._hasScroll (ce)? ce.scrollHeight: ch);

			that.parentData = {
				elemento: ce
				esquerda: co.left,
				top: co.top,
				largura: largura
				altura: altura
			};
		}
	}

	resize: function (event) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $ (this) .resizable ("instance"),
			o = que.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = {
				top: 0,
				esquerda: 0
			}
			ce = that.containerElement,
			continueResize = true;

		if (ce [0]! == documento && (/ static /) .test (ce.css ("position")))) {
			cop = co;
		}

		if (cp.left <(that._helper? co.left: 0)) {
			that.size.width = that.size.width +
				(que.helper?
					(that.position.left - co.left):
					(that.position.left - cop.left));

			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
			that.position.left = o.helper? co.left: 0;
		}

		if (cp.top <(that._helper? co.top: 0)) {
			that.size.height = that.size.height +
				(que.helper?
					(that.position.top - co.top):
					that.position.top);

			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
			that.position.top = that._helper? co.top: 0;
		}

		isParent = that.containerElement.get (0) === that.element.parent (). get (0);
		isOffsetRelative = /relative|absolute/.test (that.containerElement.css ("position"));

		if (isParent && isOffsetRelative) {
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
		} outro {
			that.offset.left = that.element.offset (). esquerda;
			that.offset.top = that.element.offset (). top;
		}

		woset = Math.abs (that.sizeDiff.width +
			(que.helper?
				that.offset.left - cop.left:
				(that.offset.left - co.left)));

		hoset = Math.abs (that.sizeDiff.height +
			(que.helper?
				that.offset.top - cop.top:
				(that.offset.top - co.top)));

		if (woset + that.size.width> = that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
		}

		if (hoset + that.size.height> = that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
		}

		if (! continueResize) {
			that.position.left = that.prevPosition.left;
			that.position.top = that.prevPosition.top;
			that.size.width = that.prevSize.width;
			that.size.height = that.prevSize.height;
		}
	}

	stop: function () {
		var que = $ (this) .resizable ("instance"),
			o = que.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $ (that.helper),
			ho = helper.offset (),
			w = helper.outerWidth () - that.sizeDiff.width,
			h = helper.outerHeight () - that.sizeDiff.height;

		if (that._helper &&! o.animate && (/ relative /) .test (ce.css ("posição")))) {
			$ (this) .css ({
				à esquerda: ho.left - cop.left - co.left,
				largura: w,
				altura: h
			});
		}

		if (that._helper &&! o.animate && (/ static /) .test (ce.css ("posição")))) {
			$ (this) .css ({
				à esquerda: ho.left - cop.left - co.left,
				largura: w,
				altura: h
			});
		}
	}
});

$ .ui.plugin.add ("redimensionável", "tambémResize", {

	start: function () {
		var que = $ (this) .resizable ("instance"),
			o = que.options;

		$ (o.alsoResize) .each (function () {
			var el = $ (this);
			el.data ("ui-redimensionável-alsoresize", {
				largura: parseFloat (el.width ()), altura: parseFloat (el.height ()),
				left: parseFloat (el.css ("left")), top: parseFloat (el.css ("top"))
			});
		});
	}

	resize: function (event, ui) {
		var que = $ (this) .resizable ("instance"),
			o = que.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0,
				width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0,
				left: (that.position.left - op.left) || 0
			};

			$ (o.alsoResize) .each (function () {
				var el = $ (this), start = $ (this) .data ("ui-redimensionável-alsoresize"), style = {},
					css = el.parents (ui.originalElement [0]) .length?
							[ "largura altura" ] :
							["width", "height", "top", "left"];

				$ .each (css, função (i, prop) {
					var sum = (iniciar [prop] || 0) + (delta [prop] || 0);
					if (sum && sum> = 0) {
						estilo [prop] = soma || nulo;
					}
				});

				el.css (estilo);
			});
	}

	stop: function () {
		$ (this) .removeData ("ui-redimensionável-alsoresize");
	}
});

$ .ui.plugin.add ("redimensionável", "fantasma", {

	start: function () {

		var que = $ (this) .resizable ("instance"), cs = that.size;

		that.ghost = that.originalElement.clone ();
		that.ghost.css ({
			opacidade: 0,25,
			display: "bloco",
			posição: "relativo",
			height: cs.height,
			largura: cs.width,
			margem: 0,
			esquerda: 0,
			top: 0
		});

		that._addClass (that.ghost, "ui-resizable-ghost");

		// DESCONTINUADA
		// TODO: remove após 1.12
		if ($ .uiBackCompat! == false && typeof that.options.ghost === "string") {

			// opção fantasma
			that.ghost.addClass (this.options.ghost);
		}

		that.ghost.appendTo (that.helper);

	}

	resize: function () {
		var que = $ (this) .resizable ("instance");
		if (that.ghost) {
			that.ghost.css ({
				posição: "relativo",
				height: that.size.height,
				width: that.size.width
			});
		}
	}

	stop: function () {
		var que = $ (this) .resizable ("instance");
		if (that.ghost && that.helper) {
			that.helper.get (0) .removeChild (that.ghost.get (0));
		}
	}

});

$ .ui.plugin.add ("redimensionável", "grid", {

	resize: function () {
		var outerDimensions,
			that = $ (this) .resizable ("instance"),
			o = que.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = this.axis,
			grid = typeof o.grid === "número"? [o.grid, o.grid]: o.grid,
			gridX = (grid [0] || 1),
			gridY = (grid [1] || 1),
			ox = Math.round ((cs.width - os.width) / gridX) * gridX,
			oy = Math.round ((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth <newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight <newHeight),
			isMinWidth = o.minWidth && (o.minWidth> newWidth),
			isMinHeight = o.minHeight && (o.minHeight> newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth + = gridX;
		}
		if (isMinHeight) {
			newHeight + = gridY;
		}
		if (isMaxWidth) {
			newWidth - = gridX;
		}
		if (isMaxHeight) {
			newHeight - = gridY;
		}

		if (/ ^ (se | s | e) $ /. teste (a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/ ^ (ne) $ /. test (a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/ ^ (sw) $ /. teste (a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - boi;
		} outro {
			if (newHeight - gridY <= 0 || newWidth - gridX <= 0) {
				outerDimensions = that._getPaddingPlusBorderDimensions (this);
			}

			if (newHeight - gridY> 0) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} outro {
				newHeight = gridY - outerDimensions.height;
				that.size.height = newHeight;
				that.position.top = op.top + os.height - newHeight;
			}
			if (newWidth - gridX> 0) {
				that.size.width = newWidth;
				that.position.left = op.left - boi;
			} outro {
				newWidth = gridX - outerDimensions.width;
				that.size.width = newWidth;
				that.position.left = op.left + os.width - newWidth;
			}
		}
	}

});

var widgetsResizable = $ .ui.resizable;


/ *!
 jQuery UI Dialog 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Diálogo
// >> group: Widgets
// >> description: Exibe janelas de diálogo personalizáveis.
// >> docs: http://api.jqueryui.com/dialog/
// >> demos: http://jqueryui.com/dialog/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/dialog.css
//>>css.theme: ../../themes/base/theme.css



$ .widget ("ui.dialog", {
	versão: "1.12.1",
	opções: {
		appendTo: "body",
		autoOpen: true
		botões: [],
		classes: {
			"ui-dialog": "ui-corner-all",
			"ui-dialog-titlebar": "ui-canto-tudo"
		}
		closeOnEscape: true,
		closeText: "Fechar",
		draggable: true
		esconder: nulo,
		height: "auto",
		maxHeight: null,
		maxWidth: null,
		minHeight: 150,
		minWidth: 150,
		modal: falso,
		position: {
			meu: "centro"
			em: "center",
			de: janela,
			colisão: "encaixe"

			// Assegure-se de que a barra de títulos esteja sempre visível
			usando: function (pos) {
				var topOffset = $ (this) .css (pos) .offset (). top;
				if (topOffset <0) {
					$ (this) .css ("top", pos.top - topOffset);
				}
			}
		}
		redimensionável: true
		show: nulo,
		título: null,
		largura: 300,

		// Callbacks
		beforeClose: null,
		close: null,
		arrastar: nulo
		dragStart: null,
		dragStop: null,
		foco: null,
		aberto: null,
		redimensionar: null,
		resizeStart: null,
		resizeStop: null
	}

	sizeRelatedOptions: {
		botões: verdadeiro
		height: true
		maxHeight: true
		maxWidth: true
		minHeight: true
		minWidth: true
		largura: true
	}

	resizableRelatedOptions: {
		maxHeight: true
		maxWidth: true
		minHeight: true
		minWidth: true
	}

	_create: function () {
		this.originalCss = {
			display: this.element [0] .style.display,
			width: this.element [0] .style.width,
			minHeight: this.element [0] .style.minHeight,
			maxHeight: this.element [0] .style.maxHeight,
			height: this.element [0] .style.height
		};
		this.originalPosition = {
			pai: this.element.parent (),
			index: this.element.parent (). children (). index (this.element)
		};
		this.originalTitle = this.element.attr ("título");
		if (this.options.title == null && this.originalTitle! = null) {
			this.options.title = this.originalTitle;
		}

		// Diálogos não podem ser desativados
		if (this.options.disabled) {
			this.options.disabled = false;
		}

		this._createWrapper ();

		this.element
			.exposição()
			.removeAttr ("title")
			.appendTo (this.uiDialog);

		this._addClass ("ui-dialog-content", "ui-widget-content");

		this._createTitlebar ();
		this._createButtonPane ();

		if (this.options.draggable && $ .fn.draggable) {
			this._makeDraggable ();
		}
		if (this.options.resizable && $ .fn.resizable) {
			this._makeResizable ();
		}

		this._isOpen = false;

		this._trackFocus ();
	}

	_init: function () {
		if (this.options.autoOpen) {
			this.open ();
		}
	}

	_appendTo: function () {
		var element = this.options.appendTo;
		if (elemento && (element.jquery || element.nodeType)) {
			return $ (elemento);
		}
		return this.document.find (element || "body") .eq (0);
	}

	_destroy: function () {
		var next,
			originalPosition = this.originalPosition;

		this._untrackInstance ();
		this._destroyOverlay ();

		this.element
			.removeUniqueId ()
			.css (this.originalCss)

			// Sem desanexar primeiro, o seguinte se torna muito lento
			.detach ();

		this.uiDialog.remove ();

		if (this.originalTitle) {
			this.element.attr ("title", this.originalTitle);
		}

		next = originalPosition.parent.children (). eq (originalPosition.index);

		// Não tente colocar o diálogo ao lado de si mesmo (# 8613)
		if (next.length && next [0]! == this.element [0]) {
			next.before (this.element);
		} outro {
			originalPosition.parent.append (this.element);
		}
	}

	widget: function () {
		return this.uiDialog;
	}

	desativar: $ .noop,
	ativar: $ .noop,

	close: function (event) {
		var isso = isto;

		if (! this._isOpen || this._trigger ("beforeClose", evento) === false) {
			Retorna;
		}

		this._isOpen = false;
		this._focusedElement = null;
		this._destroyOverlay ();
		this._untrackInstance ();

		if (! this.opener.filter (": focusable") .trigger ("foco") .length) {

			// Ocultar um elemento focado não dispara o desfoque no WebKit
			// então, caso não tenhamos nada para focar, explique explicitamente o elemento ativo
			// https://bugs.webkit.org/show_bug.cgi?id=47182
			$ .ui.safeBlur ($ .ui.safeActiveElement (this.document [0]));
		}

		this._hide (this.uiDialog, this.options.hide, function () {
			that._trigger ("fechar", evento);
		});
	}

	isOpen: function () {
		return this._isOpen;
	}

	moveToTop: function () {
		this._moveToTop ();
	}

	_moveToTop: function (event, silent) {
		var move = false,
			zIndices = this.uiDialog.siblings (".ui-front: visible") .map (function () {
				return + $ (this) .css ("z-index");
			} ).pegue(),
			zIndexMax = Math.max.apply (nulo, zIndices);

		if (zIndexMax> = + this.uiDialog.css ("z-index")) {
			this.uiDialog.css ("z-index", zIndexMax + 1);
			move = true;
		}

		if (movido &&! silencioso) {
			this._trigger ("focus", evento);
		}
		retorno movido;
	}

	aberto: function () {
		var isso = isto;
		if (this._isOpen) {
			if (this._moveToTop ()) {
				this._focusTabbable ();
			}
			Retorna;
		}

		this._isOpen = true;
		this.opener = $ ($ .ui.safeActiveElement (this.document [0]));

		this._size ();
		Este cargo();
		this._createOverlay ();
		this._moveToTop (null, true);

		// Assegure-se de que a sobreposição seja movida para o topo com o diálogo, mas somente quando
		// abertura. A sobreposição não deve se mover após a abertura da caixa de diálogo
		// diálogos sem janela aberta após a caixa de diálogo modal corretamente.
		if (this.overlay) {
			this.overlay.css ("z-index", this.uiDialog.css ("z-index") - 1);
		}

		this._show (this.uiDialog, this.options.show, function () {
			that._focusTabbable ();
			that._trigger ("focus");
		});

		// Acompanhe a caixa de diálogo imediatamente após a abertura, no caso de um evento de foco
		// de alguma forma ocorre fora do diálogo antes de um elemento dentro do
		// diálogo está focado (# 10152)
		this._makeFocusTarget ();

		this._trigger ("open");
	}

	_focusTabbable: function () {

		// Definir o foco para a primeira correspondência:
		// 1. Um elemento que foi focado anteriormente
		// 2. Primeiro elemento dentro da caixa de diálogo correspondente [autofocus]
		// 3. Elemento tabbable dentro do elemento content
		// 4. Elemento de tabulação dentro do painel
		// 5. O botão Fechar
		// 6. O diálogo em si
		var hasFocus = this._focusedElement;
		if (! hasFocus) {
			hasFocus = this.element.find ("[autofoco]");
		}
		if (! hasFocus.length) {
			hasFocus = this.element.find (": tabbable");
		}
		if (! hasFocus.length) {
			hasFocus = this.uiDialogButtonPane.find (": tabbable");
		}
		if (! hasFocus.length) {
			hasFocus = this.uiDialogTitlebarClose.filter (": tabbable");
		}
		if (! hasFocus.length) {
			hasFocus = this.uiDialog;
		}
		hasFocus.eq (0) .trigger ("focus");
	}

	_keepFocus: function (event) {
		function checkFocus () {
			var activeElement = $ .ui.safeActiveElement (this.document [0]),
				isActive = this.uiDialog [0] === activeElement ||
					$ .contains (this.uiDialog [0], activeElement);
			if (! isActive) {
				this._focusTabbable ();
			}
		}
		event.preventDefault ();
		checkFocus.call (isso);

		// support: IE
		// IE <= 8 não impede a movimentação de foco mesmo com event.preventDefault ()
		// então checamos novamente mais tarde
		this._delay (checkFocus);
	}

	_createWrapper: function () {
		this.uiDialog = $ ("<div>")
			.ocultar()
			.attr ({

				// Definir tabIndex torna o div focalizável
				tabIndex: -1,
				papel: "diálogo"
			})
			.appendTo (this._appendTo ());

		this._addClass (this.uiDialog, "ui-dialog", "ui-widget ui-widget-conteúdo ui-front");
		this._on (this.uiDialog, {
			keydown: function (event) {
				if (this.options.closeOnEscape &&! event.isDefaultPrevented () && event.keyCode &&
						event.keyCode === $ .ui.keyCode.ESCAPE) {
					event.preventDefault ();
					this.close (evento);
					Retorna;
				}

				// Impede a tabulação de diálogos
				if (event.keyCode! == $ .ui.keyCode.TAB || event.isDefaultPrevented ()) {
					Retorna;
				}
				var tabbables = this.uiDialog.find (": tabbable"),
					first = tabbables.filter (": first"),
					last = tabbables.filter (": last");

				if ((event.target === last [0] || event.target === this.uiDialog [0]) &&
						! event.shiftKey) {
					this._delay (function () {
						first.trigger ("focus");
					});
					event.preventDefault ();
				} else if ((event.target === primeiro [0] ||
						event.target === this.uiDialog [0]) && event.shiftKey) {
					this._delay (function () {
						last.trigger ("focus");
					});
					event.preventDefault ();
				}
			}
			mousedown: function (event) {
				if (this._moveToTop (event)) {
					this._focusTabbable ();
				}
			}
		});

		// Assumimos que qualquer atributo de ária descrito por atributo
		// que o conteúdo da caixa de diálogo esteja marcado corretamente
		// caso contrário, nós forçaremos o conteúdo como a descrição
		if (! this.element.find ("[descrito pela aria]") .comprimento) {
			this.uiDialog.attr ({
				"aria-describedby": this.element.uniqueId (). attr ("id")
			});
		}
	}

	_createTitlebar: function () {
		var uiDialogTitle;

		this.uiDialogTitlebar = $ ("<div>");
		this._addClass (this.uiDialogTitlebar,
			"ui-dialog-titlebar", "ui-widget-cabeçalho ui-helper-clearfix");
		this._on (this.uiDialogTitlebar, {
			mousedown: function (event) {

				// Não previna clique no botão fechar (# 8838)
				// Focando uma caixa de diálogo que é parcialmente rolada fora da vista
				// faz com que o navegador role até a visualização, evitando o evento click
				if (! $ (event.target) .closest (".ui-dialog-titlebar-close")) {

					// A caixa de diálogo não está recebendo foco ao arrastar (# 8063)
					this.uiDialog.trigger ("focus");
				}
			}
		});

		// Suporte: IE
		// Use type = "button" para impedir que o pressionamento de tecla nas caixas de texto feche o
		// diálogo no IE (# 9312)
		this.uiDialogTitlebarClose = $ ("<tipo de botão = 'botão'> </ button>")
			.button ({
				label: $ ("<a>") .text (this.options.closeText) .html (),
				ícone: "ui-icon-closethick",
				showLabel: false
			})
			.appendTo (this.uiDialogTitlebar);

		this._addClass (this.uiDialogTitlebarClose, "ui-dialog-titlebar-close");
		this._on (this.uiDialogTitlebarClose, {
			click: function (event) {
				event.preventDefault ();
				this.close (evento);
			}
		});

		uiDialogTitle = $ ("<span>") .uniqueId (). prependTo (this.uiDialogTitlebar);
		this._addClass (uiDialogTitle, "ui-dialog-title");
		this._title (uiDialogTitle);

		this.uiDialogTitlebar.prependTo (this.uiDialog);

		this.uiDialog.attr ({
			"aria-labelledby": uiDialogTitle.attr ("id")
		});
	}

	_title: function (title) {
		if (this.options.title) {
			title.text (this.options.title);
		} outro {
			title.html ("& # 160;");
		}
	}

	_createButtonPane: function () {
		this.uiDialogButtonPane = $ ("<div>");
		this._addClass (this.uiDialogButtonPane, "ui-dialog-buttonpane",
			"ui-widget-content ui-helper-clearfix");

		this.uiButtonSet = $ ("<div>")
			.appendTo (this.uiDialogButtonPane);
		this._addClass (this.uiButtonSet, "ui-dialog-buttonset");

		this._createButtons ();
	}

	_createButtons: function () {
		var isso = isso,
			botões = this.options.buttons;

		// Se já tivermos um painel de botões, remova-o
		this.uiDialogButtonPane.remove ();
		this.uiButtonSet.empty ();

		if ($ .isEmptyObject (botões) || ($ .isArray (botões) &&! buttons.length)) {
			this._removeClass (this.uiDialog, "ui-dialog-buttons");
			Retorna;
		}

		$ .each (botões, função (nome, adereços) {
			var click, buttonOptions;
			props = $ .isFunction (props)?
				{clique: adereços, texto: nome}:
				adereços;

			// Padrão para um botão de não envio
			props = $ .extend ({type: "button"}, props);

			// Altere o contexto para o retorno de chamada de clique para ser o elemento principal
			click = props.click;
			buttonOptions = {
				ícone: props.icon,
				iconPosition: props.iconPosition,
				showLabel: props.showLabel,

				// Opções obsoletas
				ícones: props.icons,
				texto: props.text
			};

			delete props.click;
			delete props.icon;
			delete props.iconPosition;
			delete props.showLabel;

			// Opções obsoletas
			delete props.icons;
			if (typeof props.text === "booleano") {
				delete props.text;
			}

			$ ("<botão> </ button>", adereços)
				botão (buttonOptions)
				.appendTo (that.uiButtonSet)
				.on ("clique", function () {
					click.apply (that.element [0], argumentos);
				});
		});
		this._addClass (this.uiDialog, "ui-dialog-buttons");
		this.uiDialogButtonPane.appendTo (this.uiDialog);
	}

	_makeDraggable: function () {
		var isso = isso,
			opções = this.options;

		função filtradaUi (ui) {
			Retorna {
				posição: ui.position,
				deslocamento: ui.offset
			};
		}

		this.uiDialog.draggable ({
			cancelar: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			contenção: "documento",
			start: function (event, ui) {
				that._addClass ($ (this), "ui-dialog-dragging");
				that._blockFrames ();
				that._trigger ("dragStart", evento, filtradoUi (ui));
			}
			arraste: função (evento, ui) {
				that._trigger ("arrastar", evento, filtradoUi (ui));
			}
			stop: function (event, ui) {
				var left = ui.offset.left - that.document.scrollLeft (),
					top = ui.offset.top - that.document.scrollTop ();

				options.position = {
					meu: "top esquerdo",
					em: "left" + (left> = 0? "+": "") + left + "" +
						"topo" + (topo> = 0? "+": "") + topo,
					de: that.window
				};
				that._removeClass ($ (this), "ui-dialog-dragging");
				that._unblockFrames ();
				that._trigger ("dragStop", evento, filtradoUi (ui));
			}
		});
	}

	_makeResizable: function () {
		var isso = isso,
			options = this.options,
			handles = options.resizable,

			// .ui-resizable tem position: relative definida na folha de estilo
			// mas os diálogos têm que usar posicionamento absoluto ou fixo
			position = this.uiDialog.css ("position"),
			resizeHandles = tipo de handles === "string"?
				alças:
				"n, e, s, w, se, sw, ne, nw";

		função filtradaUi (ui) {
			Retorna {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				posição: ui.position,
				tamanho: ui.size
			};
		}

		this.uiDialog.resizable ({
			cancelar: ".ui-dialog-content",
			contenção: "documento",
			tambémResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight (),
			alças: resizeHandles,
			start: function (event, ui) {
				that._addClass ($ (this), "ui-dialog-resizing");
				that._blockFrames ();
				that._trigger ("resizeStart", evento, filtradoUi (ui));
			}
			resize: function (event, ui) {
				that._trigger ("redimensionar", evento, filtradoUi (ui));
			}
			stop: function (event, ui) {
				var offset = that.uiDialog.offset (),
					left = offset.left - that.document.scrollLeft (),
					top = offset.top - that.document.scrollTop ();

				options.height = that.uiDialog.height ();
				options.width = that.uiDialog.width ();
				options.position = {
					meu: "top esquerdo",
					em: "left" + (left> = 0? "+": "") + left + "" +
						"topo" + (topo> = 0? "+": "") + topo,
					de: that.window
				};
				that._removeClass ($ (this), "ui-dialog-resizing");
				that._unblockFrames ();
				that._trigger ("resizeStop", evento, filtradoUi (ui));
			}
		})
			.css ("posição", posição);
	}

	_trackFocus: function () {
		this._on (this.widget (), {
			focusin: function (event) {
				this._makeFocusTarget ();
				this._focusedElement = $ (event.target);
			}
		});
	}

	_makeFocusTarget: function () {
		this._untrackInstance ();
		this._trackingInstances (). unshift (isso);
	}

	_untrackInstance: function () {
		var instances = this._trackingInstances (),
			exists = $ .inArray (isso, instâncias);
		if (existe! == -1) {
			instance.splice (existe, 1);
		}
	}

	_trackingInstances: function () {
		var instances = this.document.data ("ui-dialog-instances");
		if (! instances) {
			instances = [];
			this.document.data ("ui-dialog-instances", instances);
		}
		devolver instâncias;
	}

	_minHeight: function () {
		var options = this.options;

		return options.height === "auto"?
			opções.minHeight:
			Math.min (options.minHeight, options.height);
	}

	_position: function () {

		// Precisa mostrar o diálogo para obter o deslocamento real no plugin de posição
		var isVisible = this.uiDialog.is (": visible");
		if (! isVisible) {
			this.uiDialog.show ();
		}
		this.uiDialog.position (this.options.position);
		if (! isVisible) {
			this.uiDialog.hide ();
		}
	}

	_setOptions: function (options) {
		var isso = isso,
			resize = false,
			resizableOptions = {};

		$ .each (opções, função (chave, valor) {
			that._setOption (chave, valor);

			if (key em that.sizeRelatedOptions) {
				resize = true;
			}
			if (key in that.resizableRelatedOptions) {
				resizableOptions [chave] = valor;
			}
		});

		if (resize) {
			this._size ();
			Este cargo();
		}
		if (this.uiDialog.is (": data (ui-resizable)")) {
			this.uiDialog.resizable ("option", resizableOptions);
		}
	}

	_setOption: function (key, value) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		if (chave === "desativado") {
			Retorna;
		}

		this._super (chave, valor);

		if (chave === "appendTo") {
			this.uiDialog.appendTo (this._appendTo ());
		}

		if (key === "botões") {
			this._createButtons ();
		}

		if (chave === "closeText") {
			this.uiDialogTitlebarClose.button ({

				// Garanta que sempre passemos uma string
				label: $ ("<a>") .text ("" + this.options.closeText) .html ()
			});
		}

		if (chave === "arrastável") {
			isDraggable = uiDialog.is (": data (ui-draggable)");
			if (isDraggable &&! value) {
				uiDialog.draggable ("destruir");
			}

			if (! isDraggable && value) {
				this._makeDraggable ();
			}
		}

		if (chave === "posição") {
			Este cargo();
		}

		if (key === "redimensionável") {

			// atualmente redimensionável, tornando-se não redimensionável
			isResizable = uiDialog.is (": data (ui-redimensionável)");
			if (isResizable &&! value) {
				uiDialog.resizable ("destruir");
			}

			// Atualmente redimensionável, mudando de alças
			if (isResizable && typeof value === "string") {
				uiDialog.resizable ("option", "handles", value);
			}

			// Atualmente não redimensionável, tornando-se redimensionável
			if (! isResizable && value! == false) {
				this._makeResizable ();
			}
		}

		if (chave === "título") {
			this._title (this.uiDialogTitlebar.find (".ui-dialog-title"));
		}
	}

	_size: function () {

		// Se o usuário tiver redimensionado a caixa de diálogo, o diálogo .ui e o conteúdo do diálogo -ui
		// divs terão largura e altura definidas, então precisamos redefini-las
		var nonContentHeight, minContentHeight, maxContentHeight,
			opções = this.options;

		// Redefinir o tamanho do conteúdo
		this.element.show (). css ({
			largura: "auto",
			minHeight: 0,
			maxHeight: "nenhum",
			altura: 0
		});

		if (options.minWidth> options.width) {
			options.width = options.minWidth;
		}

		// Redefinir o tamanho do wrapper
		// determina a altura de todos os elementos que não são de conteúdo
		nonContentHeight = this.uiDialog.css ({
			height: "auto",
			largura: options.width
		})
			.outerHeight ();
		minContentHeight = Math.max (0, options.minHeight - nonContentHeight);
		maxContentHeight = typeof options.maxHeight === "numero"?
			Math.max (0, options.maxHeight - nonContentHeight):
			"Nenhum";

		if (options.height === "auto") {
			this.element.css ({
				minHeight: minContentHeight,
				maxHeight: maxContentHeight,
				height: "auto"
			});
		} outro {
			this.element.height (Math.max (0, options.height - nonContentHeight));
		}

		if (this.uiDialog.is (": data (ui-resizable)")) {
			this.uiDialog.resizable ("option", "minHeight", this._minHeight ());
		}
	}

	_blockFrames: function () {
		this.iframeBlocks = this.document.find ("iframe") .map (function () {
			var iframe = $ (isso);

			return $ ("<div>")
				.css ({
					posição: "absoluto",
					width: iframe.outerWidth (),
					altura: iframe.outerHeight ()
				})
				.appendTo (iframe.parent ())
				offset (iframe.offset ()) [0];
		});
	}

	_unblockFrames: function () {
		if (this.iframeBlocks) {
			this.iframeBlocks.remove ();
			exclua this.iframeBlocks;
		}
	}

	_allowInteraction: function (event) {
		if ($ (event.target) .closest (".ui-dialog") .comprimento) {
			retorno verdadeiro;
		}

		// TODO: Remover hack quando o datepicker implementa
		// a lógica .ui-front (# 8989)
		return !! $ (event.target) .closest (".ui-datepicker") .length;
	}

	_createOverlay: function () {
		if (! this.options.modal) {
			Retorna;
		}

		// Usamos um atraso no caso em que a sobreposição é criada a partir de um
		// evento que vamos cancelar (# 2804)
		var isOpening = true;
		this._delay (function () {
			isOpening = false;
		});

		if (! this.document.data ("ui-dialog-overlays")) {

			// Impedir o uso de âncoras e insumos
			// Usando _on () para um manipulador de eventos compartilhado entre várias instâncias é
			// seguro porque as caixas de diálogo são empilhadas e devem ser fechadas na ordem inversa
			this._on (this.document, {
				focusin: function (event) {
					if (isOpening) {
						Retorna;
					}

					if (! this._allowInteraction (event)) {
						event.preventDefault ();
						this._trackingInstances () [0] ._ focusTabbable ();
					}
				}
			});
		}

		this.overlay = $ ("<div>")
			.appendTo (this._appendTo ());

		this._addClass (this.overlay, null, "ui-widget-sobreposição ui-front");
		this._on (this.overlay, {
			mousedown: "_keepFocus"
		});
		this.document.data ("ui-dialog-overlays",
			(this.document.data ("ui-dialog-overlays") || 0) + 1);
	}

	_destroyOverlay: function () {
		if (! this.options.modal) {
			Retorna;
		}

		if (this.overlay) {
			var overlays = this.document.data ("ui-dialog-overlays") - 1;

			if (! overlays) {
				this._off (este documento, "focusin");
				this.document.removeData ("ui-dialog-overlays");
			} outro {
				this.document.data ("ui-dialog-overlays", sobreposições);
			}

			this.overlay.remove ();
			this.overlay = nulo;
		}
	}
});

// DESCONTINUADA
// TODO: alterna de volta para a declaração de widget na parte superior do arquivo quando isso é removido
if ($ .uiBackCompat! == false) {

	// Backcompat para a opção dialogClass
	$ .widget ("ui.dialog", $ .ui.dialog, {
		opções: {
			dialogClass: ""
		}
		_createWrapper: function () {
			this._super ();
			this.uiDialog.addClass (this.options.dialogClass);
		}
		_setOption: function (key, value) {
			if (chave === "dialogClass") {
				this.uiDialog
					.removeClass (this.options.dialogClass)
					.addClass (valor);
			}
			this._superApply (argumentos);
		}
	});
}

var widgetsDialog = $ .ui.dialog;


/ *!
 * jQuery UI Droppable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Droppable
// >> group: Interações
// >> description: permite soltar alvos para elementos arrastáveis.
// >> docs: http://api.jqueryui.com/droppable/
// >> demos: http://jqueryui.com/droppable/



$ .widget ("ui.droppable", {
	versão: "1.12.1",
	widgetEventPrefix: "drop",
	opções: {
		aceitar: "*",
		addClasses: true
		ganancioso: falso
		escopo: "padrão",
		tolerância: "intersect",

		// Callbacks
		ativar: nulo,
		desativar: nulo,
		gota: nulo,
		out: null,
		mais: null
	}
	_create: function () {

		proporções var,
			o = this.options,
			aceita = o.aceito;

		this.isover = false;
		this.isout = true;

		this.accept = $ .isFunction (aceitar)? aceita: function (d) {
			return d.is (aceitar);
		};

		this.proportions = function (/ * valueToWrite * /) {
			if (argument.length) {

				// Armazena as proporções do droppable
				proporções = argumentos [0];
			} outro {

				// Recuperar ou derivar as proporções do droppable
				proporções de retorno?
					proporções:
					proporções = {
						width: this.element [0] .offsetWidth,
						height: this.element [0] .offsetHeight
					};
			}
		};

		this._addToManager (o.scope);

		o.addClasses && this._addClass ("ui-droppable");

	}

	_addToManager: function (scope) {

		// Adicione a referência e as posições ao gerente
		$ .ui.ddmanager.droppables [scope] = $ .ui.ddmanager.droppables [scope] || [];
		$ .ui.ddmanager.droppables [scope] .push (this);
	}

	_splice: function (drop) {
		var i = 0;
		para (; i <drop.length; i ++) {
			if (soltar [i] === isso) {
				drop.splice (i, 1);
			}
		}
	}

	_destroy: function () {
		var drop = $ .ui.ddmanager.droppables [this.options.scope];

		this._splice (soltar);
	}

	_setOption: function (key, value) {

		if (chave === "aceitar") {
			this.accept = $ .isFunction (valor)? valor: função (d) {
				return d.is (valor);
			};
		} else if (key === "scope") {
			var drop = $ .ui.ddmanager.droppables [this.options.scope];

			this._splice (soltar);
			this._addToManager (valor);
		}

		this._super (chave, valor);
	}

	_activate: function (event) {
		var draggable = $ .ui.ddmanager.current;

		this._addActiveClass ();
		if (arrastável) {
			this._trigger ("activate", event, this.ui (arrastável));
		}
	}

	_deactivate: function (event) {
		var draggable = $ .ui.ddmanager.current;

		this._removeActiveClass ();
		if (arrastável) {
			this._trigger ("desativar", evento, this.ui (arrastável));
		}
	}

	_over: function (event) {

		var draggable = $ .ui.ddmanager.current;

		// Bail if draggable e droppable são o mesmo elemento
		if (! arrastável || (draggable.currentItem ||
				draggable.element) [0] === this.element [0]) {
			Retorna;
		}

		if (this.accept.call (this.element [0], (draggable.currentItem ||)
				draggable.element))) {
			this._addHoverClass ();
			this._trigger ("over", event, this.ui (arrastável));
		}

	}

	_out: function (event) {

		var draggable = $ .ui.ddmanager.current;

		// Bail if draggable e droppable são o mesmo elemento
		if (! arrastável || (draggable.currentItem ||
				draggable.element) [0] === this.element [0]) {
			Retorna;
		}

		if (this.accept.call (this.element [0], (draggable.currentItem ||)
				draggable.element))) {
			this._removeHoverClass ();
			this._trigger ("out", event, this.ui (arrastável));
		}

	}

	_drop: function (event, custom) {

		var draggable = custom || $ .ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable e droppable são o mesmo elemento
		if (! arrastável || (draggable.currentItem ||
				draggable.element) [0] === this.element [0]) {
			retorna falso;
		}

		this.element
			.find (": data (ui-droppable)")
			.not ("arrastar arrastável")
			.each (function () {
				var inst = $ (this) .droppable ("instância");
				E se (
					inst.options.greedy &&
					! inst.options.disabled &&
					inst.options.scope === draggable.options.scope &&
					inst.accept.call (
						inst.element [0], (draggable.currentItem || draggable.element)
					) &&
					intersectar (
						draggable
						$ .extend (inst, {offset: inst.element.offset ()}),
						inst.options.tolerance, event
					)
				) {
					childrenIntersection = true;
					retorna falso; }
			});
		if (childrenIntersection) {
			retorna falso;
		}

		if (this.accept.call (this.element [0],
				(draggable.currentItem || draggable.element))) {
			this._removeActiveClass ();
			this._removeHoverClass ();

			this._trigger ("drop", event, this.ui (arrastável));
			retornar this.element;
		}

		retorna falso;

	}

	ui: function (c) {
		Retorna {
			arrastável: (c.currentItem || c.element),
			ajudante: c.helper,
			posição: c.position,
			deslocamento: c.positionAbs
		};
	}

	// Pontos de extensão apenas para tornar o backcompat são e evitar a duplicação da lógica
	// TODO: Remove in 1.13 junto com a chamada abaixo
	_addHoverClass: function () {
		this._addClass ("ui-droppable-hover");
	}

	_removeHoverClass: function () {
		this._removeClass ("ui-droppable-hover");
	}

	_addActiveClass: function () {
		this._addClass ("ui-droppable-active");
	}

	_removeActiveClass: function () {
		this._removeClass ("ui-droppable-active");
	}
});

var intersect = $ .ui.intersect = (function () {
	função isOverAxis (x, referência, tamanho) {
		return (x> = referência) && (x <(referência + tamanho));
	}

	função de retorno (arrastável, droppable, toleranceMode, event) {

		if (! droppable.offset) {
			retorna falso;
		}

		var x1 = (draggable.positionAbs ||
				draggable.position.absolute) .left + draggable.margins.left,
			y1 = (draggable.positionAbs ||
				draggable.position.absolute) .top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions (). largura,
			b = t + droppable.proportions (). height;

		switch (toleranceMode) {
		case "fit":
			retorno (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
		case "intersect":
			return (l <x1 + (draggable.helperProportions.width / 2) && // Metade Direita
				x2 - (draggable.helperProportions.width / 2) <r && // Metade esquerda
				t <y1 + (draggable.helperProportions.height / 2) && // Bottom Half
				y2 - (draggable.helperProportions.height / 2) <b); // Metade superior
		caso "ponteiro":
			return isOverAxis (event.pageY, t, droppable.proportions (). height) &&
				isOverAxis (event.pageX, l, droppable.proportions (). width);
		caso "toque":
			Retorna (
				(y1> = t && y1 <= b) || // borda superior tocando
				(y2> = t && y2 <= b) || // Borda inferior tocando
				(y1 <t && y2> b) // Cercado verticalmente
			) && (
				(x1> = l && x1 <= r) || // Borda esquerda tocando
				(x2> = l && x2 <= r) || // Borda direita tocando
				(x1 <l && x2> r) // Cercado horizontalmente
			);
		padrão:
			retorna falso;
		}
	};
}) ();

/ *
	Este gerenciador rastreia deslocamentos de draggables e droppables
* /
$ .ui.ddmanager = {
	atual: null,
	droppables: {"default": []},
	prepareOffsets: function (t, event) {

		var i, j,
			m = $ .ui.ddmanager.droppables [t.options.scope] || []
			type = event? event.type: null, // solução alternativa para # 2317
			list = (t.currentItem || t.element) .find (": data (ui-droppable)") .addBack ();

		droppablesLoop: para (i = 0; i <m.length; i ++) {

			// Não desativado e não aceito
			if (m [i] .options.disabled || (t &&! m [i] .accept.call (m [i] .elemento [0],
					(t.currentItem || t.element)))) {
				continuar;
			}

			// Filtra os elementos no item arrastado atual
			para (j = 0; j <list.length; j ++) {
				if (listar [j] === m [i] .elemento [0]) {
					m [i] .proportions (). height = 0;
					continue droppablesLoop;
				}
			}

			m [i] .visible = m [i] .element.css ("display")! == "nenhum";
			if (! m [i] .visible) {
				continuar;
			}

			// Ativar o droppable se usado diretamente de draggables
			if (tipo === "mousedown") {
				m [i] ._ activate.call (m [i], evento);
			}

			m [i] .offset = m [i] .element.offset ();
			m [i] .proportions ({
				width: m [i] .element [0] .offsetWidth,
				height: m [i] .element [0] .offsetHeight
			});

		}

	}
	drop: function (draggable, event) {

		var dropped = false;

		// Cria uma cópia dos droppables no caso da lista mudar durante o drop (# 9116)
		$ .each (($ .ui.ddmanager.droppables [draggable.options.scope] || []) .slice (), function () {

			if (! this.options) {
				Retorna;
			}
			if (! this.options.disabled && this.visible &&
					intersect (arrastável, this.options.tolerance, event)) {
				caiu = this._drop.call (isso, evento) || desistiu;
			}

			if (! this.options.disabled && this.visible && this.accept.call (this.element [0],
					(draggable.currentItem || draggable.element))) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call (this, event);
			}

		});
		retorno caiu;

	}
	dragStart: function (draggable, event) {

		// Ouça a rolagem para que, se o arrastar causar a rolagem da posição do
		// droppables podem ser recalculados (veja # 5003)
		draggable.element.parentsUntil ("body") .on ("scroll.droppable", function () {
			if (! draggable.options.refreshPositions) {
				$ .ui.ddmanager.prepareOffsets (draggable, event);
			}
		});
	}
	drag: function (draggable, event) {

		// Se você tiver uma página altamente dinâmica, poderá tentar essa opção. Ele renderiza posições
		// toda vez que você mover o mouse.
		if (draggable.options.refreshPositions) {
			$ .ui.ddmanager.prepareOffsets (draggable, event);
		}

		// Percorra todos os droppables e verifique suas posições com base em opções específicas de tolerância
		$ .each ($ .ui.ddmanager.droppables [draggable.options.scope] || [], function () {

			if (this.options.disabled || this.greedyChild ||! this.visible) {
				Retorna;
			}

			var parentInstance, escopo, pai,
				intersects = intersect (arrastável, this.options.tolerance, event),
				c =! intersects && this.isover?
					"está fora" :
					(intersecta &&! this.isover? "isover": nulo);
			if (! c) {
				Retorna;
			}

			if (this.options.greedy) {

				// encontra pais dropáveis ​​com o mesmo escopo
				scope = this.options.scope;
				parent = this.element.parents (": data (ui-droppable)") .filter (function () {
					return $ (this) .droppable ("instance") .options.scope === escopo;
				});

				if (parent.length) {
					parentInstance = $ (parent [0]) .droppable ("instance");
					parentInstance.greedyChild = (c === "isover");
				}
			}

			// Acabamos de nos mudar para uma criança gananciosa
			if (parentInstance && c === "isover") {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call (parentInstance, event);
			}

			isso [c] = verdadeiro;
			isso [c === "isout"? "isover": "isout"] = falso;
			isso [c === "isover"? "_over": "_out"] .call (this, event);

			// Acabamos de sair de uma criança gananciosa
			if (parentInstance && c === "isout") {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call (parentInstance, event);
			}
		});

	}
	dragStop: function (draggable, event) {
		draggable.element.parentsUntil ("body") .off ("scroll.droppable");

		// Chama prepareOffsets uma última vez, pois o IE não dispara eventos de rolagem de retorno quando
		// estouro foi causado por arrastar (veja # 5003)
		if (! draggable.options.refreshPositions) {
			$ .ui.ddmanager.prepareOffsets (draggable, event);
		}
	}
};

// DESCONTINUADA
// TODO: alterna de volta para a declaração de widget na parte superior do arquivo quando isso é removido
if ($ .uiBackCompat! == false) {

	// Backcompat para as opções activeClass e hoverClass
	$ .widget ("ui.droppable", $ .ui.droppable, {
		opções: {
			hoverClass: false,
			activeClass: false
		}
		_addActiveClass: function () {
			this._super ();
			if (this.options.activeClass) {
				this.element.addClass (this.options.activeClass);
			}
		}
		_removeActiveClass: function () {
			this._super ();
			if (this.options.activeClass) {
				this.element.removeClass (this.options.activeClass);
			}
		}
		_addHoverClass: function () {
			this._super ();
			if (this.options.hoverClass) {
				this.element.addClass (this.options.hoverClass);
			}
		}
		_removeHoverClass: function () {
			this._super ();
			if (this.options.hoverClass) {
				this.element.removeClass (this.options.hoverClass);
			}
		}
	});
}

var widgetsDroppable = $ .ui.droppable;


/ *!
 * jQuery UI Progressbar 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: barra de progresso
// >> group: Widgets
// jscs: disable maximumLineLength
// >> description: Exibe um indicador de status para o estado de carregamento, porcentagem padrão e outros indicadores de progresso.
// jscs: enable maximumLineLength
// >> docs: http://api.jqueryui.com/progressbar/
// >> demos: http://jqueryui.com/progressbar/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/progressbar.css
//>>css.theme: ../../themes/base/theme.css



var widgetsProgressbar = $ .widget ("ui.progressbar", {
	versão: "1.12.1",
	opções: {
		classes: {
			"ui-progressbar": "ui-corner-all",
			"ui-progressbar-value": "ui-corner-left",
			"ui-progressbar-complete": "ui-corner-right"
		}
		max: 100,
		valor: 0,

		mudança: null,
		completo: null
	}

	min: 0,

	_create: function () {

		// Restringir valor inicial
		this.oldValue = this.options.value = this._constrainedValue ();

		this.element.attr ({

			// Apenas definir valores estáticos; aria-valuenow e aria-valuemax são
			// set dentro de _refreshValue ()
			papel: "barra de progresso",
			"aria-valuemin": this.min
		});
		this._addClass ("ui-progressbar", "ui-widget ui-widget-content");

		this.valueDiv = $ ("<div>") .appendTo (this.element);
		this._addClass (this.valueDiv, "ui-progressbar-value", "ui-widget-header");
		this._refreshValue ();
	}

	_destroy: function () {
		this.element.removeAttr ("papel aria-valuemin aria-valormax aria-valuenow");

		this.valueDiv.remove ();
	}

	valor: function (newValue) {
		if (newValue === undefined) {
			return this.options.value;
		}

		this.options.value = this._constrainedValue (newValue);
		this._refreshValue ();
	}

	_constrainedValue: function (newValue) {
		if (newValue === undefined) {
			newValue = this.options.value;
		}

		this.indeterminate = newValue === false;

		// Sanitize o valor
		if (typeof newValue! == "number") {
			newValue = 0;
		}

		return this.indeterminate? falso:
			Math.min (this.options.max, Math.max (this.min, newValue));
	}

	_setOptions: function (options) {

		// Assegure-se de que a opção "value" esteja definida após outros valores (como max)
		var value = options.value;
		delete options.value;

		this._super (opções);

		this.options.value = this._constrainedValue (valor);
		this._refreshValue ();
	}

	_setOption: function (key, value) {
		if (chave === "max") {

			// Não permita um máximo menor que min
			valor = Math.max (this.min, valor);
		}
		this._super (chave, valor);
	}

	_setOptionDisabled: function (value) {
		this._super (valor);

		this.element.attr ("aria-disabled", valor);
		this._toggleClass (null, "ui-state-disabled", valor !!);
	}

	_percentage: function () {
		return this.indeterminate?
			100:
			100 * (this.options.value - this.min) / (this.options.max - this.min);
	}

	_refreshValue: function () {
		var value = this.options.value,
			porcentagem = this._percentage ();

		this.valueDiv
			.toggle (this.indeterminate || value> this.min)
			Largura (porcentagem.aFixada (0) + "%");

		esta
			._toggleClass (this.valueDiv, "ui-progressbar-complete", null,
				valor === this.options.max)
			._toggleClass ("ui-progressbar-indeterminate", null, this.indeterminate);

		if (this.indeterminate) {
			this.element.removeAttr ("aria-valuenow");
			if (! this.overlayDiv) {
				this.overlayDiv = $ ("<div>") .appendTo (this.valueDiv);
				this._addClass (this.overlayDiv, "ui-progressbar-overlay");
			}
		} outro {
			this.element.attr ({
				"aria-valuemax": this.options.max,
				"aria-valuenow": valor
			});
			if (this.overlayDiv) {
				this.overlayDiv.remove ();
				this.overlayDiv = null;
			}
		}

		if (this.oldValue! == value) {
			this.oldValue = valor;
			this._trigger ("mudança");
		}
		if (valor === this.options.max) {
			this._trigger ("complete");
		}
	}
});


/ *!
 * jQuery UI selecionável 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: selecionável
// >> group: Interações
// >> description: Permite que grupos de elementos sejam selecionados com o mouse.
// >> docs: http://api.jqueryui.com/selectable/
// >> demos: http://jqueryui.com/selectable/
//>>css.structure: ../../themes/base/selectable.css



var widgetsSelectable = $ .widget ("ui.selecionável", $ .ui.mouse, {
	versão: "1.12.1",
	opções: {
		appendTo: "body",
		autoRefresh: true
		distância: 0,
		filtro: "*",
		tolerância: "toque",

		// Callbacks
		selecionado: null,
		selecionando: null,
		início: null,
		stop: null,
		não selecionado: null,
		desmarcando: null
	}
	_create: function () {
		var isso = isto;

		this._addClass ("selecionável por ui");

		this.dragged = false;

		// Cache selectee children based on filter
		this.refresh = function () {
			that.elementPos = $ (that.element [0]) .offset ();
			that.selectees = $ (that.options.filter, that.element [0]);
			that._addClass (that.selectees, "ui-selectee");
			that.selectees.each (function () {
				var $ this = $ (this),
					selecteeOffset = $ this.offset (),
					pos = {
						left: selecteeOffset.left - that.elementPos.left,
						top: selecteeOffset.top - that.elementPos.top
					};
				$ .data (isso, "item selecionável", {
					elemento: isso,
					$ element: $ this,
					esquerda: pos.left,
					top: pos.top,
					direita: pos.left + $ this.outerWidth (),
					inferior: pos.top + $ this.outerHeight (),
					startselected: false,
					selecionado: $ this.hasClass ("ui-selected"),
					selecionando: $ this.hasClass ("ui-selection"),
					desmarcando: $ this.hasClass ("selecionando não")
				});
			});
		};
		this.refresh ();

		this._mouseInit ();

		this.helper = $ ("<div>");
		this._addClass (this.helper, "ui-selectable-helper");
	}

	_destroy: function () {
		this.selectees.removeData ("item selecionável");
		this._mouseDestroy ();
	}

	_mouseStart: function (event) {
		var isso = isso,
			opções = this.options;

		this.opos = [event.pageX, event.pageY];
		this.elementPos = $ (this.element [0]) .offset ();

		if (this.options.disabled) {
			Retorna;
		}

		this.selectees = $ (options.filter, this.element [0]);

		this._trigger ("start", evento);

		$ (options.appendTo) .append (this.helper);

		// position helper (lasso)
		this.helper.css ({
			"esquerda": event.pageX,
			"top": event.pageY,
			"largura": 0,
			"altura": 0
		});

		if (options.autoRefresh) {
			this.refresh ();
		}

		this.selectees.filter (".ui-selected") .each (function () {
			var selectee = $ .data (isso, "item selecionável");
			selectee.startselected = true;
			if (! event.metaKey &&! event.ctrlKey) {
				that._removeClass (selectee. $ element, "ui-selected");
				selectee.selected = false;
				that._addClass (selectee. $ element, "ui-unselecting");
				selectee.unselecting = true;

				// selectable UNSELECTING callback
				that._trigger ("desmarcando", evento, {
					desmarcando: selectee.element
				});
			}
		});

		$ (event.target) .parents (). addBack (). each (function () {
			var doSelect,
				selectee = $ .data (isto, "item selecionável");
			if (selectee) {
				doSelect = (! event.metaKey &&! event.ctrlKey) ||
					selectee $ element.hasClass ("ui-selected");
				that._removeClass (selectee. $ element, doSelect? "ui-desmarcando": "ui-selected")
					._addClass (selectee. $ element, doSelect? "selecionando-ui": "ui-desmarcando");
				selectee.unselecting =! doSelect;
				selectee.selecting = doSelect;
				selectee.selected = doSelect;

				// selectable (UN) SELECTING callback
				if (doSelect) {
					that._trigger ("selecionando", evento, {
						selecionando: selectee.element
					});
				} outro {
					that._trigger ("desmarcando", evento, {
						desmarcando: selectee.element
					});
				}
				retorna falso;
			}
		});

	}

	_mouseDrag: function (event) {

		this.dragged = true;

		if (this.options.disabled) {
			Retorna;
		}

		var tmp,
			isso = isto
			options = this.options,
			x1 = this.opos [0],
			y1 = this.opos [1],
			x2 = event.pageX,
			y2 = event.pageY;

		if (x1> x2) {tmp = x2; x2 = x1; x1 = tmp; }
		if (y1> y2) {tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css ({left: x1, top: y1, largura: x2 - x1, altura: y2 - y1});

		this.selectees.each (function () {
			var selectee = $ .data (isso, "item selecionável"),
				hit = false,
				offset = {};

			// impede que o auxiliar seja selecionado se appendTo: selecionável
			if (! selectee || selectee.element === that.element [0]) {
				Retorna;
			}

			offset.left = selectee.left + that.elementPos.left;
			offset.right = selectee.right + that.elementPos.left;
			offset.top = selectee.top + that.elementPos.top;
			offset.bottom = selectee.bottom + that.elementPos.top;

			if (options.tolerance === "tocar") {
				hit = (! (offset.left> x2 || offset.right <x1 || offset.top> y2 ||
                    offset.bottom <y1));
			} else if (options.tolerance === "fit") {
				hit = (offset.left> x1 && offset.right <x2 && offset.top> y1 &&
                    offset.bottom <y2);
			}

			if (hit) {

				// SELECT
				if (selectee.selected) {
					that._removeClass (selectee. $ element, "ui-selected");
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					that._removeClass (selectee. $ element, "ui-unselecting");
					selectee.unselecting = false;
				}
				if (! selectee.selecting) {
					that._addClass (selectee. $ element, "ui-selection");
					selectee.selecting = true;

					// selectable SELECTING callback
					that._trigger ("selecionando", evento, {
						selecionando: selectee.element
					});
				}
			} outro {

				// UNSELECT
				if (selectee.selecting) {
					if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
						that._removeClass (selectee. $ element, "ui-selection");
						selectee.selecting = false;
						that._addClass (selectee. $ element, "ui-selected");
						selectee.selected = true;
					} outro {
						that._removeClass (selectee. $ element, "ui-selection");
						selectee.selecting = false;
						if (selectee.startselected) {
							that._addClass (selectee. $ element, "ui-unselecting");
							selectee.unselecting = true;
						}

						// selectable UNSELECTING callback
						that._trigger ("desmarcando", evento, {
							desmarcando: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (! event.metaKey &&! event.ctrlKey &&! selectee.startselected) {
						that._removeClass (selectee. $ element, "ui-selected");
						selectee.selected = false;

						that._addClass (selectee. $ element, "ui-unselecting");
						selectee.unselecting = true;

						// selectable UNSELECTING callback
						that._trigger ("desmarcando", evento, {
							desmarcando: selectee.element
						});
					}
				}
			}
		});

		retorna falso;
	}

	_mouseStop: function (event) {
		var isso = isto;

		this.dragged = false;

		$ (". deselecionando-se", this.element [0]) .each (function () {
			var selectee = $ .data (isso, "item selecionável");
			that._removeClass (selectee. $ element, "ui-unselecting");
			selectee.unselecting = false;
			selectee.startselected = false;
			that._trigger ("não selecionado", evento, {
				não selecionado: selectee.element
			});
		});
		$ (".ui-select", this.element [0]) .each (function () {
			var selectee = $ .data (isso, "item selecionável");
			that._removeClass (selectee. $ element, "ui-selection")
				._addClass (selectee. $ element, "ui-selected");
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			that._trigger ("selected", evento, {
				selecionado: selectee.element
			});
		});
		this._trigger ("stop", evento);

		this.helper.remove ();

		retorna falso;
	}

});


/ *!
 jmenu UI Selectmenu 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: menu de seleção
// >> group: Widgets
// jscs: disable maximumLineLength
// >> description: Duplica e estende a funcionalidade de um elemento nativo de seleção de HTML, permitindo que ele seja personalizável em comportamento e aparência, muito além das limitações de uma seleção nativa.
// jscs: enable maximumLineLength
// >> docs: http://api.jqueryui.com/selectmenu/
// >> demos: http://jqueryui.com/selectmenu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/selectmenu.css, ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css



var widgetsSelectmenu = $ .widget ("ui.selectmenu", [$ .ui.formResetMixin, {
	versão: "1.12.1",
	defaultElement: "<select>",
	opções: {
		appendTo: null,
		classes: {
			"ui-selectmenu-button-open": "ui-canto-top",
			"ui-selectmenu-button-closed": "ui-canto-tudo"
		}
		desativado: nulo
		ícones: {
			botão: "ui-icon-triangle-1-s"
		}
		position: {
			meu: "top esquerdo",
			em: "fundo esquerdo",
			colisão: "nenhum"
		}
		largura: falso

		// Callbacks
		mudança: null,
		close: null,
		foco: null,
		aberto: null,
		selecione: null
	}

	_create: function () {
		var selectmenuId = this.element.uniqueId (). attr ("id");
		this.ids = {
			elemento: selectmenuId,
			botão: selectmenuId + "-button",
			menu: selectmenuId + "-menu"
		};

		this._drawButton ();
		this._drawMenu ();
		this._bindFormResetHandler ();

		this._rendered = falso;
		this.menuItems = $ ();
	}

	_drawButton: function () {
		ícone var,
			isso = isto
			item = this._parseOption (
				this.element.find ("opção: selecionada"),
				this.element [0] .selectedIndex
			);

		// Associa o rótulo existente ao novo botão
		this.labels = this.element.labels (). attr ("para", this.ids.button);
		this._on (this.labels, {
			click: function (event) {
				this.button.focus ();
				event.preventDefault ();
			}
		});

		// Hide original select element
		this.element.hide ();

		// botão Criar
		this.button = $ ("<span>", {
			tabindex: this.options.disabled? -1: 0,
			id: this.ids.button,
			papel: "combobox",
			"aria-expandido": "falso",
			"aria-autocomplete": "list",
			"aria-possui": this.ids.menu,
			"aria-haspopup": "true",
			title: this.element.attr ("título")
		})
			.insertAfter (this.element);

		this._addClass (this.button, "botão ui-selectmenu-ui-selectmenu-button-fechado",
			"ui-button ui-widget");

		icon = $ ("<span>") .appendTo (this.button);
		this._addClass (ícone, "ui-selectmenu-icon", "ícone-ui" + this.options.icons.button);
		this.buttonItem = this._renderButtonItem (item)
			.appendTo (this.button);

		if (this.options.width! == false) {
			this._resizeButton ();
		}

		this._on (this.button, this._buttonEvents);
		this.button.one ("focusin", function () {

			// Atrasa a renderização dos itens do menu até que o botão receba foco.
			// O menu já pode ter sido processado por meio de uma abertura programática.
			if (! that._rendered) {
				that._refreshMenu ();
			}
		});
	}

	_drawMenu: function () {
		var isso = isto;

		// Cria o menu
		this.menu = $ ("<ul>", {
			"aria-hidden": "true",
			"aria-labelledby": this.ids.button,
			id: this.ids.menu
		});

		// menu Wrap
		this.menuWrap = $ ("<div>") .append (this.menu);
		this._addClass (this.menuWrap, "ui-selectmenu-menu", "ui-front");
		this.menuWrap.appendTo (this._appendTo ());

		// Inicializar o widget de menu
		this.menuInstance = this.menu
			.cardápio( {
				classes: {
					"menu ui": "ui-canto-fundo"
				}
				role: "listbox",
				selecione: function (event, ui) {
					event.preventDefault ();

					// Suporte: IE8
					// Se o item foi selecionado através de um clique, a seleção de texto
					// será destruído no IE
					that._setSelection ();

					that._select (ui.item.data ("ui-selectmenu-item"), evento);
				}
				foco: função (evento, ui) {
					var item = ui.item.data ("ui-selectmenu-item");

					// Impedir que o foco inicial seja disparado e verificar se é um item recém-focalizado
					if (that.focusIndex! = null && item.index! == that.focusIndex) {
						that._trigger ("focus", evento, {item: item});
						if (! that.isOpen) {
							that._select (item, evento);
						}
					}
					that.focusIndex = item.index;

					that.button.attr ("aria-activedescendant",
						that.menuItems.eq (item.index) .attr ("id"));
				}
			})
			.menu ("instance");

		// Não feche o menu em mouseleave
		this.menuInstance._off (this.menu, "mouseleave");

		// Cancelar o colapso do menuTudo no clique do documento
		esta. menuInstance._closeOnDocumentClick = function () {
			retorna falso;
		};

		// As seleções geralmente contêm itens vazios, mas nunca contêm divisores
		this.menuInstance._isDivider = function () {
			retorna falso;
		};
	}

	refresh: function () {
		this._refreshMenu ();
		this.buttonItem.replaceWith (
			this.buttonItem = this._renderButtonItem (

				// Retorna para um objeto vazio no caso de não haver opções
				this._getSelectedItem (). data ("ui-selectmenu-item") || {}
			)
		);
		if (this.options.width === null) {
			this._resizeButton ();
		}
	}

	_refreshMenu: function () {
		var item,
			options = this.element.find ("opção");

		this.menu.empty ();

		this._parseOptions (opções);
		this._renderMenu (this.menu, this.items);

		this.menuInstance.refresh ();
		this.menuItems = this.menu.find ("li")
			.not (".ui-selectmenu-optgroup")
				.find (".ui-menu-item-wrapper");

		this._rendered = true;

		if (! options.length) {
			Retorna;
		}

		item = this._getSelectedItem ();

		// Atualiza o menu para ter o item correto focado
		this.menuInstance.focus (null, item);
		this._setAria (item.data ("ui-selectmenu-item"));

		// Definir estado desativado
		this._setOption ("disabled", this.element.prop ("disabled"));
	}

	open: function (event) {
		if (this.options.disabled) {
			Retorna;
		}

		// Se esta é a primeira vez que o menu está sendo aberto, renderize os itens
		if (! this._rendered) {
			this._refreshMenu ();
		} outro {

			// Menu apaga o foco no fechamento, redefine o foco para o item selecionado
			this._removeClass (this.menu.find (".-estado-ativo"), null, "ui-state-active");
			this.menuInstance.focus (null, this._getSelectedItem ());
		}

		// Se não houver opções, não abra o menu
		if (! this.menuItems.length) {
			Retorna;
		}

		this.isOpen = true;
		this._toggleAttr ();
		this._resizeMenu ();
		Este cargo();

		this._on (this.document, this._documentClick);

		this._trigger ("open", evento);
	}

	_position: function () {
		this.menuWrap.position ($ .extend ({of: this.button}, this.options.position));
	}

	close: function (event) {
		if (! this.isOpen) {
			Retorna;
		}

		this.isOpen = false;
		this._toggleAttr ();

		this.range = nulo;
		this._off (este documento);

		this._trigger ("fechar", evento);
	}

	widget: function () {
		retorne this.button;
	}

	menuWidget: function () {
		return this.menu;
	}

	_renderButtonItem: function (item) {
		var buttonItem = $ ("<span>");

		this._setText (buttonItem, item.label);
		this._addClass (buttonItem, "ui-selectmenu-text");

		return buttonItem;
	}

	_renderMenu: function (ul, items) {
		var isso = isso,
			currentOptgroup = "";

		$ .each (itens, função (índice, item) {
			var li;

			if (item.optgroup! == currentOptgroup) {
				li = $ ("<li>", {
					texto: item.optgroup
				});
				that._addClass (li, "ui-selectmenu-optgroup", "ui-menu-divider" +
					(item.element.parent ("optgroup") .prop ("desativado")?
						"desativado pelo estado-ui":
						""));

				li.appendTo (ul);

				currentOptgroup = item.optgroup;
			}

			that._renderItemData (ul, item);
		});
	}

	_renderItemData: function (ul, item) {
		return this._renderItem (ul, item) .data ("ui-selectmenu-item", item);
	}

	_renderItem: function (ul, item) {
		var li = $ ("<li>"),
			wrapper = $ ("<div>", {
				title: item.element.attr ("título")
			});

		if (item.disabled) {
			this._addClass (li, null, "ui-state-disabled");
		}
		this._setText (wrapper, item.label);

		retornar li.append (wrapper) .appendTo (ul);
	}

	_setText: function (element, value) {
		if (valor) {
			element.text (valor);
		} outro {
			element.html ("& # 160;");
		}
	}

	_move: function (direction, event) {
		var item, próximo
			filter = ".ui-menu-item";

		if (this.isOpen) {
			item = this.menuItems.eq (this.focusIndex) .parent ("li");
		} outro {
			item = this.menuItems.eq (this.element [0] .selectedIndex) .parent ("li");
			filtro + = ": não (. estado-desativado)";
		}

		if (direction === "first" || direção === "last") {
			next = item [direção === "primeiro"? "prevAll": "nextAll"] (filtro) .eq (-1);
		} outro {
			next = item [direção + "Todos"] (filtro) .eq (0);
		}

		if (next.length) {
			this.menuInstance.focus (evento, próximo);
		}
	}

	_getSelectedItem: function () {
		return this.menuItems.eq (this.element [0] .selectedIndex) .parent ("li");
	}

	_toggle: function (event) {
		isso [this.isOpen? "fechar": "abrir"] (evento);
	}

	_setSelection: function () {
		seleção var;

		if (! this.range) {
			Retorna;
		}

		if (window.getSelection) {
			selection = window.getSelection ();
			selection.removeAllRanges ();
			selection.addRange (this.range);

		// Suporte: IE8
		} outro {
			this.range.select ();
		}

		// Suporte: IE
		// Definir a seleção de texto mata o foco do botão no IE, mas
		// restaurar o foco não mata a seleção.
		this.button.focus ();
	}

	_documentClick: {
		mousedown: function (event) {
			if (! this.isOpen) {
				Retorna;
			}

			if (! $ (event.target) .closest ("menu-selecione-menu, #" +
					$ .ui.escapeSelector (this.ids.button)) .length) {
				this.close (evento);
			}
		}
	}

	_buttonEvents: {

		// Impede que a seleção de texto seja redefinida ao interagir com o menu de seleção (# 10144)
		mousedown: function () {
			seleção var;

			if (window.getSelection) {
				selection = window.getSelection ();
				if (selection.rangeCount) {
					this.range = selection.getRangeAt (0);
				}

			// Suporte: IE8
			} outro {
				this.range = document.selection.createRange ();
			}
		}

		click: function (event) {
			this._setSelection ();
			this._toggle (evento);
		}

		keydown: function (event) {
			var preventDefault = true;
			switch (event.keyCode) {
			case $ .ui.keyCode.TAB:
			case $ .ui.keyCode.ESCAPE:
				this.close (evento);
				preventDefault = false;
				quebrar;
			case $ .ui.keyCode.ENTER:
				if (this.isOpen) {
					this._selectFocusedItem (event);
				}
				quebrar;
			case $ .ui.keyCode.UP:
				if (event.altKey) {
					this._toggle (evento);
				} outro {
					this._move ("prev", evento);
				}
				quebrar;
			case $ .ui.keyCode.DOWN:
				if (event.altKey) {
					this._toggle (evento);
				} outro {
					this._move ("next", evento);
				}
				quebrar;
			case $ .ui.keyCode.SPACE:
				if (this.isOpen) {
					this._selectFocusedItem (event);
				} outro {
					this._toggle (evento);
				}
				quebrar;
			case $ .ui.keyCode.LEFT:
				this._move ("prev", evento);
				quebrar;
			case $ .ui.keyCode.RIGHT:
				this._move ("next", evento);
				quebrar;
			case $ .ui.keyCode.HOME:
			case $ .ui.keyCode.PAGE_UP:
				this._move ("primeiro", evento);
				quebrar;
			case $ .ui.keyCode.END:
			case $ .ui.keyCode.PAGE_DOWN:
				this._move ("last", event);
				quebrar;
			padrão:
				this.menu.trigger (evento);
				preventDefault = false;
			}

			if (preventDefault) {
				event.preventDefault ();
			}
		}
	}

	_selectFocusedItem: function (event) {
		var item = this.menuItems.eq (this.focusIndex) .parent ("li");
		if (! item.hasClass ("ui-state-disabled")) {
			this._select (item.data ("ui-selectmenu-item"), evento);
		}
	}

	_selecione: function (item, event) {
		var oldIndex = this.element [0] .selectedIndex;

		// Alterar o elemento de seleção nativo
		this.element [0] .selectedIndex = item.index;
		this.buttonItem.replaceWith (this.buttonItem = this._renderButtonItem (item));
		this._setAria (item);
		this._trigger ("select", evento, {item: item});

		if (item.index! == oldIndex) {
			this._trigger ("change", evento, {item: item});
		}

		this.close (evento);
	}

	_setAria: function (item) {
		var id = this.menuItems.eq (item.index) .attr ("id");

		this.button.attr ({
			"aria-labelledby": id,
			"aria-activedescendant": id
		});
		this.menu.attr ("aria-activedescendant", id);
	}

	_setOption: function (key, value) {
		if (chave === "ícones") {
			var icon = this.button.find ("ícone span.ui");
			this._removeClass (ícone, null, this.options.icons.button)
				._addClass (ícone, nulo, valor.button);
		}

		this._super (chave, valor);

		if (chave === "appendTo") {
			this.menuWrap.appendTo (this._appendTo ());
		}

		if (key === "largura") {
			this._resizeButton ();
		}
	}

	_setOptionDisabled: function (value) {
		this._super (valor);

		this.menuInstance.option ("desativado", valor);
		this.button.attr ("aria-disabled", valor);
		this._toggleClass (this.button, null, "ui-state-disabled", valor);

		this.element.prop ("desativado", valor);
		if (valor) {
			this.button.attr ("tabindex", -1);
			this.close ();
		} outro {
			this.button.attr ("tabindex", 0);
		}
	}

	_appendTo: function () {
		var element = this.options.appendTo;

		if (element) {
			element = element.jquery || element.nodeType?
				$ (elemento):
				this.document.find (element) .eq (0);
		}

		if (! elemento ||! elemento [0]) {
			element = this.element.closest (".ui-front, dialog");
		}

		if (! element.length) {
			element = this.document [0] .body;
		}

		elemento de retorno;
	}

	_toggleAttr: function () {
		this.button.attr ("aria-expandido", this.isOpen);

		// Não podemos usar duas chamadas _toggleClass () aqui, porque precisamos ter certeza
		// sempre removemos as classes primeiro e as adicionamos em segundo lugar, caso contrário, se as duas classes tiverem
		// mesma classe de tema, ela será removida depois de adicioná-la.
		this._removeClass (this.button, "ui-selectmenu-button-" +
			(this.isOpen? "fechado": "aberto"))
			._addClass (this.button, "ui-selectmenu-button-" +
				(this.isOpen? "open": "fechado"))
			._toggleClass (this.menuWrap, "ui-selectmenu-open", null, this.isOpen);

		this.menu.attr ("aria-hidden",! this.isOpen);
	}

	_resizeButton: function () {
		var width = this.options.width;

		// Para `width: false`, apenas remova o estilo inline e pare
		if (width === false) {
			this.button.css ("largura", "");
			Retorna;
		}

		// Para `width: null`, corresponde à largura do elemento original
		if (width === null) {
			width = this.element.show (). outerWidth ();
			this.element.hide ();
		}

		this.button.outerWidth (largura);
	}

	_resizeMenu: function () {
		this.menu.outerWidth (Math.max (
			this.button.outerWidth (),

			// Suporte: IE10
			// IE10 envolve texto longo (possivelmente um erro de arredondamento)
			// então adicionamos 1px para evitar a quebra
			this.menu.width ("") .outerWidth () + 1
		));
	}

	_getCreateOptions: function () {
		var options = this._super ();

		options.disabled = this.element.prop ("desativado");

		opções de retorno;
	}

	_parseOptions: function (options) {
		var isso = isso,
			data = [];
		options.each (function (index, item) {
			data.push (that._parseOption ($ (item), index));
		});
		this.items = dados;
	}

	_parseOption: function (option, index) {
		var optgroup = option.parent ("optgroup");

		Retorna {
			elemento: opção
			índice: index,
			valor: option.val (),
			label: option.text (),
			optgroup: optgroup.attr ("label") || "",
			disabled: optgroup.prop ("desativado") || option.prop ("desativado")
		};
	}

	_destroy: function () {
		this._unbindFormResetHandler ();
		this.menuWrap.remove ();
		this.button.remove ();
		this.element.show ();
		this.element.removeUniqueId ();
		this.labels.attr ("para", this.ids.element);
	}
}]);


/ *!
 * jQuery UI Slider 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation e outros contribuidores
 * Lançado sob a licença do MIT.
 * http://jquery.org/license
 * /

// >> label: Slider
// >> group: Widgets
// >> description: Exibe um controle deslizante flexível com intervalos e acessibilidade via teclado.
// >> docs: http://api.jqueryui.com/slider/
// >> demos: http://jqueryui.com/slider/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/slider.css
//>>css.theme: ../../themes/base/theme.css



var widgetsSlider = $ .widget ("ui.slider", $ .ui.mouse, {
	versão: "1.12.1",
	widgetEventPrefix: "slide",

	opções: {
		animar: falso,
		classes: {
			"ui-slider": "ui-corner-all",
			"ui-slider-handle": "ui-canto-tudo",

			// Nota: ui-widget-header não é a classe de framework semântica mais apropriada para este
			// elemento, mas funcionou melhor visualmente com uma variedade de temas
			"ui-slider-range": "ui-canto-tudo ui-widget-header"
		}
		distância: 0,
		max: 100,
		min: 0,
		orientação: "horizontal",
		intervalo: falso
		passo 1,
		valor: 0,
		valores: null,

		// Callbacks
		mudança: null,
		slide: null,
		início: null,
		stop: null
	}

	// Número de páginas em um slider
	// (quantas vezes você pode subir / descer a página para percorrer todo o intervalo)
	numPages: 5,

	_create: function () {
		this._keySliding = falso;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation ();
		this._mouseInit ();
		this._calculateNewMax ();

		this._addClass ("ui-slider ui-slider-" + this.orientation,
			"ui-widget ui-widget-content");

		this._refresh ();

		this._animateOff = false;
	}

	_refresh: function () {
		this._createRange ();
		this._createHandles ();
		this._setupEvents ();
		this._refreshValue ();
	}

	_createHandles: function () {
		var i, handleCount,
			options = this.options,
			existingHandles = this.element.find (".ui-slider-handle"),
			handle = "<span tabindex = '0'> </ span>",
			handles = [];

		handleCount = (options.values ​​&& options.values.length) || 1;

		if (existingHandles.length> handleCount) {
			existingHandles.slice (handleCount) .remove ();
			existingHandles = existingHandles.slice (0, handleCount);
		}

		para (i = existingHandles.length; i <handleCount; i ++) {
			handles.push (handle);
		}

		this.handles = existingHandles.add ($ (handles.join ("")) .appendTo (this.element));

		this._addClass (this.handles, "ui-slider-handle", "ui-state-default");

		this.handle = this.handles.eq (0);

		this.handles.each (função (i) {
			$ (isso)
				.data ("ui-slider-handle-index", i)
				.attr ("tabIndex", 0);
		});
	}

	_createRange: function () {
		var options = this.options;

		if (options.range) {
			if (options.range === true) {
				if (! options.values) {
					options.values ​​= [this._valueMin (), this._valueMin ()];
				} else if (options.values.length && options.values.length! == 2) {
					options.values ​​= [options.values ​​[0], options.values ​​[0]];
				} else if ($ .isArray (options.values)) {
					options.values ​​= options.values.slice (0);
				}
			}

			if (! this.range ||! this.range.length) {
				this.range = $ ("<div>")
					.appendTo (this.element);

				this._addClass (this.range, "ui-slider-range");
			} outro {
				this._removeClass (this.range, "ui-slider-range-min ui-slider-range-máx");

				// Lidar com a mudança de intervalo de true para min / max
				this.range.css ({
					"esquerda": "",
					"inferior": ""
				});
			}
			if (options.range === "min" || options.range === "max") {
				this._addClass (this.range, "ui-slider-range-" + options.range);
			}
		} outro {
			if (this.range) {
				this.range.remove ();
			}
			this.range = nulo;
		}
	}

	_setupEvents: function () {
		this._off (this.handles);
		this._on (this.handles, this._handleEvents);
		this._hoverable (this.handles);
		this._focusable (this.handles);
	}

	_destroy: function () {
		this.handles.remove ();
		if (this.range) {
			this.range.remove ();
		}

		this._mouseDestroy ();
	}

	_mouseCapture: function (event) {
		var position, normValue, distance, closestHandle, index, permitido, offset, mouseOverHandle,
			isso = isto
			o = this.options;

		if (o.disabled) {
			retorna falso;
		}

		this.elementSize = {
			width: this.element.outerWidth (),
			height: this.element.outerHeight ()
		};
		this.elementOffset = this.element.offset ();

		position = {x: event.pageX, y: event.pageY};
		normValue = this._normValueFromMouse (position);
		distance = this._valueMax () - this._valueMin () + 1;
		this.handles.each (função (i) {
			var thisDistance = Math.abs (normValue - that.values ​​(i));
			if ((distance> thisDistance) ||
				(distance === thisDistance &&
					(i === that._lastChangedValue || that.values ​​(i) === o.min))) {
				distance = thisDistance;
				nearestHandle = $ (this);
				índice = i;
			}
		});

		permitido = this._start (evento, índice);
		if (permitido === false) {
			retorna falso;
		}
		this._mouseSliding = true;

		this._handleIndex = índice;

		this._addClass (nearestHandle, null, "ui-state-active");
		closerHandle.trigger ("focus");

		offset = lowestHandle.offset ();
		mouseOverHandle =! $ (event.target) .parents (). addBack (). é ("manipulador-deslizante-i");
		this._clickOffset = mouseOverHandle? {left: 0, top: 0}: {
			left: event.pageX - offset.left - (nearestHandle.width () / 2),
			top: event.pageY - offset.top -
				(closerHandle.height () / 2) -
				(parseInt (nearestHandle.css ("borderTopWidth"), 10) || 0) -
				(parseInt (nearestHandle.css ("borderBottomWidth"), 10) || 0) +
				(parseInt (nearestHandle.css ("marginTop"), 10) || 0)
		};

		if (! this.handles.hasClass ("ui-state-hover")) {
			this._slide (evento, índice, normValue);
		}
		this._animateOff = true;
		retorno verdadeiro;
	}

	_mouseStart: function () {
		retorno verdadeiro;
	}

	_mouseDrag: function (event) {
		var position = {x: event.pageX, y: event.pageY},
			normValue = this._normValueFromMouse (position);

		this._slide (event, this._handleIndex, normValue);

		retorna falso;
	}

	_mouseStop: function (event) {
		this._removeClass (this.handles, null, "ui-state-active");
		this._mouseSliding = false;

		this._stop (event, this._handleIndex);
		this._change (evento, this._handleIndex);

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		retorna falso;
	}

	_detectOrientation: function () {
		this.orientation = (this.options.orientation === "vertical")? "vertical Horizontal";
	}

	_normValueFromMouse: function (position) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valorTotal,
			valueMouse;

		if (this.orientation === "horizontal") {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left -
				(this._clickOffset? this._clickOffset.left: 0);
		} outro {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top -
				(this._clickOffset? this._clickOffset.top: 0);
		}

		percentMouse = (pixelMouse / pixelTotal);
		if (percentMouse> 1) {
			percentMouse = 1;
		}
		if (percentMouse <0) {
			percentMouse = 0;
		}
		if (this.orientation === "vertical") {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax () - this._valueMin ();
		valueMouse = this._valueMin () + percentMouse * valueTotal;

		return this._trimAlignValue (valueMouse);
	}

	_uiHash: function (index, value, values) {
		var uiHash = {
			handle: this.handles [index],
			handleIndex: index,
			valor: valor! == indefinido? valor: this.value ()
		};

		if (this._hasMultipleValues ​​()) {
			uiHash.value = valor! == indefinido? valor: this.values ​​(índice);
			uiHash.values ​​= valores || this.values ​​();
		}

		return uiHash;
	}

	_sMultipleValues: function () {
		return this.options.values ​​&& this.options.values.length;
	}

	_start: function (event, index) {
		return this._trigger ("start", event, this._uiHash (index));
	}

	_slide: function (event, index, newVal) {
		var permitido, otherVal,
			currentValue = this.value (),
			newValues ​​= this.values ​​();

		if (this._hasMultipleValues ​​()) {
			otherVal = this.values ​​(index? 0: 1);
			currentValue = this.values ​​(índice);

			if (this.options.values.length === 2 && this.options.range === true) {
				newVal = index === 0? Math.min (otherVal, newVal): Math.max (otherVal, newVal);
			}

			newValues ​​[index] = newVal;
		}

		if (newVal === currentValue) {
			Retorna;
		}

		permitido = this._trigger ("slide", evento, this._uiHash (index, newVal, newValues));

		// Um ​​slide pode ser cancelado retornando false no retorno de chamada do slide
		if (permitido === false) {
			Retorna;
		}

		if (this._hasMultipleValues ​​()) {
			this.values ​​(index, newVal);
		} outro {
			this.value (newVal);
		}
	}

	_stop: function (event, index) {
		this._trigger ("stop", event, this._uiHash (index));
	}

	_change: function (event, index) {
		if (! this._keySliding &&! this._mouseSliding) {

			// armazena o último índice de valor alterado para referência quando manipula a sobreposição
			this._lastChangedValue = índice;
			this._trigger ("change", event, this._uiHash (index));
		}
	}

	valor: function (newValue) {
		if (argument.length) {
			this.options.value = this._trimAlignValue (newValue);
			this._refreshValue ();
			this._change (nulo, 0);
			Retorna;
		}

		return this._value ();
	}

	valores: function (index, newValue) {
		var vals,
			newValues,
			Eu;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this._hasMultipleValues() ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( key === "range" && this.options.range === true ) {
			if ( value === "min" ) {
				this.options.value = this._values( 0 );
				this.options.values = null;
			} else if ( value === "max" ) {
				this.options.value = this._values( this.options.values.length - 1 );
				this.options.values = null;
			}
		}

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		this._super( key, value );

		switch ( key ) {
			case "orientation":
				this._detectOrientation();
				this._removeClass( "ui-slider-horizontal ui-slider-vertical" )
					._addClass( "ui-slider-" + this.orientation );
				this._refreshValue();
				if ( this.options.range ) {
					this._refreshRange( value );
				}

				// Reset positioning from previous orientation
				this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();

				// Start from the last handle to prevent unreachable handles (#9046)
				for ( i = valsLength - 1; i >= 0; i-- ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "step":
			case "min":
			case "max":
				this._animateOff = true;
				this._calculateNewMax();
				this._refreshValue();
				this._animateOff = false;
				break;
			case "range":
				this._animateOff = true;
				this._refresh();
				this._animateOff = false;
				break;
		}
	},

	_setOptionDisabled: function( value ) {
		this._super( value );

		this._toggleClass( null, "ui-state-disabled", !!value );
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else if ( this._hasMultipleValues() ) {

			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i += 1 ) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		} else {
			return [];
		}
	},

	// Returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = ( val - this._valueMin() ) % step,
			alignValue = val - valModStep;

		if ( Math.abs( valModStep ) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed( 5 ) );
	},

	_calculateNewMax: function() {
		var max = this.options.max,
			min = this._valueMin(),
			step = this.options.step,
			aboveMin = Math.round( ( max - min ) / step ) * step;
		max = aboveMin + min;
		if ( max > this.options.max ) {

			//If max is not divisible by step, rounding off may increase its value
			max -= step;
		}
		this.max = parseFloat( max.toFixed( this._precision() ) );
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.max;
	},

	_refreshRange: function( orientation ) {
		if ( orientation === "vertical" ) {
			this.range.css( { "width": "", "left": "" } );
		}
		if ( orientation === "horizontal" ) {
			this.range.css( { "height": "", "bottom": "" } );
		}
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this._hasMultipleValues() ) {
			this.handles.each( function( i ) {
				valPercent = ( that.values( i ) - that._valueMin() ) / ( that._valueMax() -
					that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								left: valPercent + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								width: ( valPercent - lastValPercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								bottom: ( valPercent ) + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								height: ( valPercent - lastValPercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					}
				}
				lastValPercent = valPercent;
			} );
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: valPercent + "%"
				}, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: ( 100 - valPercent ) + "%"
				}, o.animate );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: valPercent + "%"
				}, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: ( 100 - valPercent ) + "%"
				}, o.animate );
			}
		}
	},

	_handleEvents: {
		keydown: function( event ) {
			var allowed, curVal, newVal, step,
				index = $( event.target ).data( "ui-slider-handle-index" );

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_UP:
				case $.ui.keyCode.PAGE_DOWN:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					event.preventDefault();
					if ( !this._keySliding ) {
						this._keySliding = true;
						this._addClass( $( event.target ), null, "ui-state-active" );
						allowed = this._start( event, index );
						if ( allowed === false ) {
							return;
						}
					}
					break;
			}

			step = this.options.step;
			if ( this._hasMultipleValues() ) {
				curVal = newVal = this.values( index );
			} else {
				curVal = newVal = this.value();
			}

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
					newVal = this._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = this._valueMax();
					break;
				case $.ui.keyCode.PAGE_UP:
					newVal = this._trimAlignValue(
						curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
					);
					break;
				case $.ui.keyCode.PAGE_DOWN:
					newVal = this._trimAlignValue(
						curVal - ( ( this._valueMax() - this._valueMin() ) / this.numPages ) );
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					if ( curVal === this._valueMax() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal + step );
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if ( curVal === this._valueMin() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal - step );
					break;
			}

			this._slide( event, index, newVal );
		},
		keyup: function( event ) {
			var index = $( event.target ).data( "ui-slider-handle-index" );

			if ( this._keySliding ) {
				this._keySliding = false;
				this._stop( event, index );
				this._change( event, index );
				this._removeClass( $( event.target ), null, "ui-state-active" );
			}
		}
	}
} );


/*!
 * jQuery UI Sortable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Sortable
//>>group: Interactions
//>>description: Enables items in a list to be sorted using the mouse.
//>>docs: http://api.jqueryui.com/sortable/
//>>demos: http://jqueryui.com/sortable/
//>>css.structure: ../../themes/base/sortable.css



var widgetsSortable = $.widget( "ui.sortable", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// Callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return ( /left|right/ ).test( item.css( "float" ) ) ||
			( /inline|table-cell/ ).test( item.css( "display" ) );
	},

	_create: function() {
		this.containerCache = {};
		this._addClass( "ui-sortable" );

		//Get the items
		this.refresh();

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		this._setHandleClassName();

		//We're ready to go
		this.ready = true;

	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		var that = this;
		this._removeClass( this.element.find( ".ui-sortable-handle" ), "ui-sortable-handle" );
		$.each( this.items, function() {
			that._addClass(
				this.instance.options.handle ?
					this.item.find( this.instance.options.handle ) :
					this.item,
				"ui-sortable-handle"
			);
		} );
	},

	_destroy: function() {
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[ i ].item.removeData( this.widgetName + "-item" );
		}

		return this;
	},

	_mouseCapture: function( event, overrideHandle ) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if ( this.reverting ) {
			return false;
		}

		if ( this.options.disabled || this.options.type === "static" ) {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems( event );

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$( event.target ).parents().each( function() {
			if ( $.data( this, that.widgetName + "-item" ) === that ) {
				currentItem = $( this );
				return false;
			}
		} );
		if ( $.data( event.target, that.widgetName + "-item" ) === that ) {
			currentItem = $( event.target );
		}

		if ( !currentItem ) {
			return false;
		}
		if ( this.options.handle && !overrideHandle ) {
			$( this.options.handle, currentItem ).find( "*" ).addBack().each( function() {
				if ( this === event.target ) {
					validHandle = true;
				}
			} );
			if ( !validHandle ) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function( event, overrideHandle, noActivation ) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to
		// mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper( event );

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend( this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),

			// This is a relative to absolute position minus the actual position calculation -
			// only used for relative positioned helper
			relative: this._getRelativeOffset()
		} );

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css( "position", "absolute" );
		this.cssPosition = this.helper.css( "position" );

		//Generate the original position
		this.originalPosition = this._generatePosition( event );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		( o.cursorAt && this._adjustOffsetFromHelper( o.cursorAt ) );

		//Cache the former DOM position
		this.domPosition = {
			prev: this.currentItem.prev()[ 0 ],
			parent: this.currentItem.parent()[ 0 ]
		};

		// If the helper is not the original, hide the original so it's not playing any role during
		// the drag, won't cause anything bad this way
		if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if ( o.containment ) {
			this._setContainment();
		}

		if ( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// Support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet =
				$( "<style>*{ cursor: " + o.cursor + " !important; }</style>" ).appendTo( body );
		}

		if ( o.opacity ) { // opacity option
			if ( this.helper.css( "opacity" ) ) {
				this._storedOpacity = this.helper.css( "opacity" );
			}
			this.helper.css( "opacity", o.opacity );
		}

		if ( o.zIndex ) { // zIndex option
			if ( this.helper.css( "zIndex" ) ) {
				this._storedZIndex = this.helper.css( "zIndex" );
			}
			this.helper.css( "zIndex", o.zIndex );
		}

		//Prepare scrolling
		if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				this.scrollParent[ 0 ].tagName !== "HTML" ) {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger( "start", event, this._uiHash() );

		//Recache the helper size
		if ( !this._preserveHelperProportions ) {
			this._cacheHelperProportions();
		}

		//Post "activate" events to possible containers
		if ( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.current = this;
		}

		if ( $.ui.ddmanager && !o.dropBehaviour ) {
			$.ui.ddmanager.prepareOffsets( this, event );
		}

		this.dragging = true;

		this._addClass( this.helper, "ui-sortable-helper" );

		// Execute the drag once - this causes the helper not to be visiblebefore getting its
		// correct position
		this._mouseDrag( event );
		return true;

	},

	_mouseDrag: function( event ) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition( event );
		this.positionAbs = this._convertPositionTo( "absolute" );

		if ( !this.lastPositionAbs ) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if ( this.options.scroll ) {
			if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					this.scrollParent[ 0 ].tagName !== "HTML" ) {

				if ( ( this.overflowOffset.top + this.scrollParent[ 0 ].offsetHeight ) -
						event.pageY < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollTop =
						scrolled = this.scrollParent[ 0 ].scrollTop + o.scrollSpeed;
				} else if ( event.pageY - this.overflowOffset.top < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollTop =
						scrolled = this.scrollParent[ 0 ].scrollTop - o.scrollSpeed;
				}

				if ( ( this.overflowOffset.left + this.scrollParent[ 0 ].offsetWidth ) -
						event.pageX < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollLeft = scrolled =
						this.scrollParent[ 0 ].scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - this.overflowOffset.left < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollLeft = scrolled =
						this.scrollParent[ 0 ].scrollLeft - o.scrollSpeed;
				}

			} else {

				if ( event.pageY - this.document.scrollTop() < o.scrollSensitivity ) {
					scrolled = this.document.scrollTop( this.document.scrollTop() - o.scrollSpeed );
				} else if ( this.window.height() - ( event.pageY - this.document.scrollTop() ) <
						o.scrollSensitivity ) {
					scrolled = this.document.scrollTop( this.document.scrollTop() + o.scrollSpeed );
				}

				if ( event.pageX - this.document.scrollLeft() < o.scrollSensitivity ) {
					scrolled = this.document.scrollLeft(
						this.document.scrollLeft() - o.scrollSpeed
					);
				} else if ( this.window.width() - ( event.pageX - this.document.scrollLeft() ) <
						o.scrollSensitivity ) {
					scrolled = this.document.scrollLeft(
						this.document.scrollLeft() + o.scrollSpeed
					);
				}

			}

			if ( scrolled !== false && $.ui.ddmanager && !o.dropBehaviour ) {
				$.ui.ddmanager.prepareOffsets( this, event );
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo( "absolute" );

		//Set the helper position
		if ( !this.options.axis || this.options.axis !== "y" ) {
			this.helper[ 0 ].style.left = this.position.left + "px";
		}
		if ( !this.options.axis || this.options.axis !== "x" ) {
			this.helper[ 0 ].style.top = this.position.top + "px";
		}

		//Rearrange
		for ( i = this.items.length - 1; i >= 0; i-- ) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[ i ];
			itemElement = item.item[ 0 ];
			intersection = this._intersectsWithPointer( item );
			if ( !intersection ) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if ( item.instance !== this.currentContainer ) {
				continue;
			}

			// Cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if ( itemElement !== this.currentItem[ 0 ] &&
				this.placeholder[ intersection === 1 ? "next" : "prev" ]()[ 0 ] !== itemElement &&
				!$.contains( this.placeholder[ 0 ], itemElement ) &&
				( this.options.type === "semi-dynamic" ?
					!$.contains( this.element[ 0 ], itemElement ) :
					true
				)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if ( this.options.tolerance === "pointer" || this._intersectsWithSides( item ) ) {
					this._rearrange( event, item );
				} else {
					break;
				}

				this._trigger( "change", event, this._uiHash() );
				break;
			}
		}

		//Post events to containers
		this._contactContainers( event );

		//Interconnect with droppables
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.drag( this, event );
		}

		//Call callbacks
		this._trigger( "sort", event, this._uiHash() );

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function( event, noPropagation ) {

		if ( !event ) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ( $.ui.ddmanager && !this.options.dropBehaviour ) {
			$.ui.ddmanager.drop( this, event );
		}

		if ( this.options.revert ) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left +
					( this.offsetParent[ 0 ] === this.document[ 0 ].body ?
						0 :
						this.offsetParent[ 0 ].scrollLeft
					);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top +
					( this.offsetParent[ 0 ] === this.document[ 0 ].body ?
						0 :
						this.offsetParent[ 0 ].scrollTop
					);
			}
			this.reverting = true;
			$( this.helper ).animate(
				animation,
				parseInt( this.options.revert, 10 ) || 500,
				function() {
					that._clear( event );
				}
			);
		} else {
			this._clear( event, noPropagation );
		}

		return false;

	},

	cancel: function() {

		if ( this.dragging ) {

			this._mouseUp( new $.Event( "mouseup", { target: null } ) );

			if ( this.options.helper === "original" ) {
				this.currentItem.css( this._storedCSS );
				this._removeClass( this.currentItem, "ui-sortable-helper" );
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for ( var i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "deactivate", null, this._uiHash( this ) );
				if ( this.containers[ i ].containerCache.over ) {
					this.containers[ i ]._trigger( "out", null, this._uiHash( this ) );
					this.containers[ i ].containerCache.over = 0;
				}
			}

		}

		if ( this.placeholder ) {

			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
			// it unbinds ALL events from the original node!
			if ( this.placeholder[ 0 ].parentNode ) {
				this.placeholder[ 0 ].parentNode.removeChild( this.placeholder[ 0 ] );
			}
			if ( this.options.helper !== "original" && this.helper &&
					this.helper[ 0 ].parentNode ) {
				this.helper.remove();
			}

			$.extend( this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			} );

			if ( this.domPosition.prev ) {
				$( this.domPosition.prev ).after( this.currentItem );
			} else {
				$( this.domPosition.parent ).prepend( this.currentItem );
			}
		}

		return this;

	},

	serialize: function( o ) {

		var items = this._getItemsAsjQuery( o && o.connected ),
			str = [];
		o = o || {};

		$( items ).each( function() {
			var res = ( $( o.item || this ).attr( o.attribute || "id" ) || "" )
				.match( o.expression || ( /(.+)[\-=_](.+)/ ) );
			if ( res ) {
				str.push(
					( o.key || res[ 1 ] + "[]" ) +
					"=" + ( o.key && o.expression ? res[ 1 ] : res[ 2 ] ) );
			}
		} );

		if ( !str.length && o.key ) {
			str.push( o.key + "=" );
		}

		return str.join( "&" );

	},

	toArray: function( o ) {

		var items = this._getItemsAsjQuery( o && o.connected ),
			ret = [];

		o = o || {};

		items.each( function() {
			ret.push( $( o.item || this ).attr( o.attribute || "id" ) || "" );
		} );
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function( item ) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t &&
				( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l &&
				( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			( this.options.tolerance !== "pointer" &&
				this.helperProportions[ this.floating ? "width" : "height" ] >
				item[ this.floating ? "width" : "height" ] )
		) {
			return isOverElement;
		} else {

			return ( l < x1 + ( this.helperProportions.width / 2 ) && // Right Half
				x2 - ( this.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( this.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( this.helperProportions.height / 2 ) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function( item ) {
		var verticalDirection, horizontalDirection,
			isOverElementHeight = ( this.options.axis === "x" ) ||
				this._isOverAxis(
					this.positionAbs.top + this.offset.click.top, item.top, item.height ),
			isOverElementWidth = ( this.options.axis === "y" ) ||
				this._isOverAxis(
					this.positionAbs.left + this.offset.click.left, item.left, item.width ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( !isOverElement ) {
			return false;
		}

		verticalDirection = this._getDragVerticalDirection();
		horizontalDirection = this._getDragHorizontalDirection();

		return this.floating ?
			( ( horizontalDirection === "right" || verticalDirection === "down" ) ? 2 : 1 )
			: ( verticalDirection && ( verticalDirection === "down" ? 2 : 1 ) );

	},

	_intersectsWithSides: function( item ) {

		var isOverBottomHalf = this._isOverAxis( this.positionAbs.top +
				this.offset.click.top, item.top + ( item.height / 2 ), item.height ),
			isOverRightHalf = this._isOverAxis( this.positionAbs.left +
				this.offset.click.left, item.left + ( item.width / 2 ), item.width ),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if ( this.floating && horizontalDirection ) {
			return ( ( horizontalDirection === "right" && isOverRightHalf ) ||
				( horizontalDirection === "left" && !isOverRightHalf ) );
		} else {
			return verticalDirection && ( ( verticalDirection === "down" && isOverBottomHalf ) ||
				( verticalDirection === "up" && !isOverBottomHalf ) );
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && ( delta > 0 ? "down" : "up" );
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && ( delta > 0 ? "right" : "left" );
	},

	refresh: function( event ) {
		this._refreshItems( event );
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ?
			[ options.connectWith ] :
			options.connectWith;
	},

	_getItemsAsjQuery: function( connected ) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if ( connectWith && connected ) {
			for ( i = connectWith.length - 1; i >= 0; i-- ) {
				cur = $( connectWith[ i ], this.document[ 0 ] );
				for ( j = cur.length - 1; j >= 0; j-- ) {
					inst = $.data( cur[ j ], this.widgetFullName );
					if ( inst && inst !== this && !inst.options.disabled ) {
						queries.push( [ $.isFunction( inst.options.items ) ?
							inst.options.items.call( inst.element ) :
							$( inst.options.items, inst.element )
								.not( ".ui-sortable-helper" )
								.not( ".ui-sortable-placeholder" ), inst ] );
					}
				}
			}
		}

		queries.push( [ $.isFunction( this.options.items ) ?
			this.options.items
				.call( this.element, null, { options: this.options, item: this.currentItem } ) :
			$( this.options.items, this.element )
				.not( ".ui-sortable-helper" )
				.not( ".ui-sortable-placeholder" ), this ] );

		function addItems() {
			items.push( this );
		}
		for ( i = queries.length - 1; i >= 0; i-- ) {
			queries[ i ][ 0 ].each( addItems );
		}

		return $( items );

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find( ":data(" + this.widgetName + "-item)" );

		this.items = $.grep( this.items, function( item ) {
			for ( var j = 0; j < list.length; j++ ) {
				if ( list[ j ] === item.item[ 0 ] ) {
					return false;
				}
			}
			return true;
		} );

	},

	_refreshItems: function( event ) {

		this.items = [];
		this.containers = [ this ];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [ [ $.isFunction( this.options.items ) ?
				this.options.items.call( this.element[ 0 ], event, { item: this.currentItem } ) :
				$( this.options.items, this.element ), this ] ],
			connectWith = this._connectWith();

		//Shouldn't be run the first time through due to massive slow-down
		if ( connectWith && this.ready ) {
			for ( i = connectWith.length - 1; i >= 0; i-- ) {
				cur = $( connectWith[ i ], this.document[ 0 ] );
				for ( j = cur.length - 1; j >= 0; j-- ) {
					inst = $.data( cur[ j ], this.widgetFullName );
					if ( inst && inst !== this && !inst.options.disabled ) {
						queries.push( [ $.isFunction( inst.options.items ) ?
							inst.options.items
								.call( inst.element[ 0 ], event, { item: this.currentItem } ) :
							$( inst.options.items, inst.element ), inst ] );
						this.containers.push( inst );
					}
				}
			}
		}

		for ( i = queries.length - 1; i >= 0; i-- ) {
			targetData = queries[ i ][ 1 ];
			_queries = queries[ i ][ 0 ];

			for ( j = 0, queriesLength = _queries.length; j < queriesLength; j++ ) {
				item = $( _queries[ j ] );

				// Data for target checking (mouse manager)
				item.data( this.widgetName + "-item", targetData );

				items.push( {
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				} );
			}
		}

	},

	refreshPositions: function( fast ) {

		// Determine whether items are being displayed horizontally
		this.floating = this.items.length ?
			this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
			false;

		//This has to be redone because due to the item being moved out/into the offsetParent,
		// the offsetParent's position will change
		if ( this.offsetParent && this.helper ) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for ( i = this.items.length - 1; i >= 0; i-- ) {
			item = this.items[ i ];

			//We ignore calculating positions of all connected containers when we're not over them
			if ( item.instance !== this.currentContainer && this.currentContainer &&
					item.item[ 0 ] !== this.currentItem[ 0 ] ) {
				continue;
			}

			t = this.options.toleranceElement ?
				$( this.options.toleranceElement, item.item ) :
				item.item;

			if ( !fast ) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if ( this.options.custom && this.options.custom.refreshContainers ) {
			this.options.custom.refreshContainers.call( this );
		} else {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				p = this.containers[ i ].element.offset();
				this.containers[ i ].containerCache.left = p.left;
				this.containers[ i ].containerCache.top = p.top;
				this.containers[ i ].containerCache.width =
					this.containers[ i ].element.outerWidth();
				this.containers[ i ].containerCache.height =
					this.containers[ i ].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function( that ) {
		that = that || this;
		var className,
			o = that.options;

		if ( !o.placeholder || o.placeholder.constructor === String ) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[ 0 ].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[ 0 ] );

						that._addClass( element, "ui-sortable-placeholder",
								className || that.currentItem[ 0 ].className )
							._removeClass( element, "ui-sortable-helper" );

					if ( nodeName === "tbody" ) {
						that._createTrPlaceholder(
							that.currentItem.find( "tr" ).eq( 0 ),
							$( "<tr>", that.document[ 0 ] ).appendTo( element )
						);
					} else if ( nodeName === "tr" ) {
						that._createTrPlaceholder( that.currentItem, element );
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function( container, p ) {

					// 1. If a className is set as 'placeholder option, we don't force sizes -
					// the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a
					// class name is specified
					if ( className && !o.forcePlaceholderSize ) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming
					// from a stylesheet), it receives the inline height from the dragged item
					if ( !p.height() ) {
						p.height(
							that.currentItem.innerHeight() -
							parseInt( that.currentItem.css( "paddingTop" ) || 0, 10 ) -
							parseInt( that.currentItem.css( "paddingBottom" ) || 0, 10 ) );
					}
					if ( !p.width() ) {
						p.width(
							that.currentItem.innerWidth() -
							parseInt( that.currentItem.css( "paddingLeft" ) || 0, 10 ) -
							parseInt( that.currentItem.css( "paddingRight" ) || 0, 10 ) );
					}
				}
			};
		}

		//Create the placeholder
		that.placeholder = $( o.placeholder.element.call( that.element, that.currentItem ) );

		//Append it after the actual current item
		that.currentItem.after( that.placeholder );

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update( that, that.placeholder );

	},

	_createTrPlaceholder: function( sourceTr, targetTr ) {
		var that = this;

		sourceTr.children().each( function() {
			$( "<td>&#160;</td>", that.document[ 0 ] )
				.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
				.appendTo( targetTr );
		} );
	},

	_contactContainers: function( event ) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom,
			floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// Get innermost container that intersects with item
		for ( i = this.containers.length - 1; i >= 0; i-- ) {

			// Never consider a container that's located within the item itself
			if ( $.contains( this.currentItem[ 0 ], this.containers[ i ].element[ 0 ] ) ) {
				continue;
			}

			if ( this._intersectsWith( this.containers[ i ].containerCache ) ) {

				// If we've already found a container and it's more "inner" than this, then continue
				if ( innermostContainer &&
						$.contains(
							this.containers[ i ].element[ 0 ],
							innermostContainer.element[ 0 ] ) ) {
					continue;
				}

				innermostContainer = this.containers[ i ];
				innermostIndex = i;

			} else {

				// container doesn't intersect. trigger "out" event if necessary
				if ( this.containers[ i ].containerCache.over ) {
					this.containers[ i ]._trigger( "out", event, this._uiHash( this ) );
					this.containers[ i ].containerCache.over = 0;
				}
			}

		}

		// If no intersecting containers found, return
		if ( !innermostContainer ) {
			return;
		}

		// Move the item into the container if it's not there already
		if ( this.containers.length === 1 ) {
			if ( !this.containers[ innermostIndex ].containerCache.over ) {
				this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash( this ) );
				this.containers[ innermostIndex ].containerCache.over = 1;
			}
		} else {

			// When entering a new container, we will find the item with the least distance and
			// append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating( this.currentItem );
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "pageX" : "pageY";

			for ( j = this.items.length - 1; j >= 0; j-- ) {
				if ( !$.contains(
						this.containers[ innermostIndex ].element[ 0 ], this.items[ j ].item[ 0 ] )
				) {
					continue;
				}
				if ( this.items[ j ].item[ 0 ] === this.currentItem[ 0 ] ) {
					continue;
				}

				cur = this.items[ j ].item.offset()[ posProperty ];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up" : "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if ( !itemWithLeastDistance && !this.options.dropOnEmpty ) {
				return;
			}

			if ( this.currentContainer === this.containers[ innermostIndex ] ) {
				if ( !this.currentContainer.containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
					this.currentContainer.containerCache.over = 1;
				}
				return;
			}

			itemWithLeastDistance ?
				this._rearrange( event, itemWithLeastDistance, null, true ) :
				this._rearrange( event, null, this.containers[ innermostIndex ].element, true );
			this._trigger( "change", event, this._uiHash() );
			this.containers[ innermostIndex ]._trigger( "change", event, this._uiHash( this ) );
			this.currentContainer = this.containers[ innermostIndex ];

			//Update the placeholder
			this.options.placeholder.update( this.currentContainer, this.placeholder );

			this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash( this ) );
			this.containers[ innermostIndex ].containerCache.over = 1;
		}

	},

	_createHelper: function( event ) {

		var o = this.options,
			helper = $.isFunction( o.helper ) ?
				$( o.helper.apply( this.element[ 0 ], [ event, this.currentItem ] ) ) :
				( o.helper === "clone" ? this.currentItem.clone() : this.currentItem );

		//Add the helper to the DOM if that didn't happen already
		if ( !helper.parents( "body" ).length ) {
			$( o.appendTo !== "parent" ?
				o.appendTo :
				this.currentItem[ 0 ].parentNode )[ 0 ].appendChild( helper[ 0 ] );
		}

		if ( helper[ 0 ] === this.currentItem[ 0 ] ) {
			this._storedCSS = {
				width: this.currentItem[ 0 ].style.width,
				height: this.currentItem[ 0 ].style.height,
				position: this.currentItem.css( "position" ),
				top: this.currentItem.css( "top" ),
				left: this.currentItem.css( "left" )
			};
		}

		if ( !helper[ 0 ].style.width || o.forceHelperSize ) {
			helper.width( this.currentItem.width() );
		}
		if ( !helper[ 0 ].style.height || o.forceHelperSize ) {
			helper.height( this.currentItem.height() );
		}

		return helper;

	},

	_adjustOffsetFromHelper: function( obj ) {
		if ( typeof obj === "string" ) {
			obj = obj.split( " " );
		}
		if ( $.isArray( obj ) ) {
			obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
		}
		if ( "left" in obj ) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ( "right" in obj ) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ( "top" in obj ) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ( "bottom" in obj ) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the
		// following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the
		// next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
		// the document, which means that the scroll is included in the initial calculation of the
		// offset of the parent, and never recalculated upon drag
		if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this
		// information with an ugly IE fix
		if ( this.offsetParent[ 0 ] === this.document[ 0 ].body ||
				( this.offsetParent[ 0 ].tagName &&
				this.offsetParent[ 0 ].tagName.toLowerCase() === "html" && $.ui.ie ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
			left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
		};

	},

	_getRelativeOffset: function() {

		if ( this.cssPosition === "relative" ) {
			var p = this.currentItem.position();
			return {
				top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
					this.scrollParent.scrollTop(),
				left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
					this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: ( parseInt( this.currentItem.css( "marginLeft" ), 10 ) || 0 ),
			top: ( parseInt( this.currentItem.css( "marginTop" ), 10 ) || 0 )
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}
		if ( o.containment === "document" || o.containment === "window" ) {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ?
					this.document.width() :
					this.window.width() - this.helperProportions.width - this.margins.left,
				( o.containment === "document" ?
					( this.document.height() || document.body.parentNode.scrollHeight ) :
					this.window.height() || this.document[ 0 ].body.parentNode.scrollHeight
				) - this.helperProportions.height - this.margins.top
			];
		}

		if ( !( /^(document|window|parent)$/ ).test( o.containment ) ) {
			ce = $( o.containment )[ 0 ];
			co = $( o.containment ).offset();
			over = ( $( ce ).css( "overflow" ) !== "hidden" );

			this.containment = [
				co.left + ( parseInt( $( ce ).css( "borderLeftWidth" ), 10 ) || 0 ) +
					( parseInt( $( ce ).css( "paddingLeft" ), 10 ) || 0 ) - this.margins.left,
				co.top + ( parseInt( $( ce ).css( "borderTopWidth" ), 10 ) || 0 ) +
					( parseInt( $( ce ).css( "paddingTop" ), 10 ) || 0 ) - this.margins.top,
				co.left + ( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
					( parseInt( $( ce ).css( "borderLeftWidth" ), 10 ) || 0 ) -
					( parseInt( $( ce ).css( "paddingRight" ), 10 ) || 0 ) -
					this.helperProportions.width - this.margins.left,
				co.top + ( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
					( parseInt( $( ce ).css( "borderTopWidth" ), 10 ) || 0 ) -
					( parseInt( $( ce ).css( "paddingBottom" ), 10 ) || 0 ) -
					this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function( d, pos ) {

		if ( !pos ) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" &&
				!( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ?
					this.offsetParent :
					this.scrollParent,
			scrollIsRootNode = ( /(html|body)/i ).test( scroll[ 0 ].tagName );

		return {
			top: (

				// The absolute mouse position
				pos.top	+

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top * mod -
				( ( this.cssPosition === "fixed" ?
					-this.scrollParent.scrollTop() :
					( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod )
			),
			left: (

				// The absolute mouse position
				pos.left +

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left * mod	-
				( ( this.cssPosition === "fixed" ?
					-this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 :
					scroll.scrollLeft() ) * mod )
			)
		};

	},

	_generatePosition: function( event ) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" &&
				!( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ?
					this.offsetParent :
					this.scrollParent,
				scrollIsRootNode = ( /(html|body)/i ).test( scroll[ 0 ].tagName );

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if ( this.cssPosition === "relative" && !( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				this.scrollParent[ 0 ] !== this.offsetParent[ 0 ] ) ) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if ( this.originalPosition ) { //If we are not dragging yet, we won't check for options

			if ( this.containment ) {
				if ( event.pageX - this.offset.click.left < this.containment[ 0 ] ) {
					pageX = this.containment[ 0 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top < this.containment[ 1 ] ) {
					pageY = this.containment[ 1 ] + this.offset.click.top;
				}
				if ( event.pageX - this.offset.click.left > this.containment[ 2 ] ) {
					pageX = this.containment[ 2 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top > this.containment[ 3 ] ) {
					pageY = this.containment[ 3 ] + this.offset.click.top;
				}
			}

			if ( o.grid ) {
				top = this.originalPageY + Math.round( ( pageY - this.originalPageY ) /
					o.grid[ 1 ] ) * o.grid[ 1 ];
				pageY = this.containment ?
					( ( top - this.offset.click.top >= this.containment[ 1 ] &&
						top - this.offset.click.top <= this.containment[ 3 ] ) ?
							top :
							( ( top - this.offset.click.top >= this.containment[ 1 ] ) ?
								top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) :
								top;

				left = this.originalPageX + Math.round( ( pageX - this.originalPageX ) /
					o.grid[ 0 ] ) * o.grid[ 0 ];
				pageX = this.containment ?
					( ( left - this.offset.click.left >= this.containment[ 0 ] &&
						left - this.offset.click.left <= this.containment[ 2 ] ) ?
							left :
							( ( left - this.offset.click.left >= this.containment[ 0 ] ) ?
								left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) :
								left;
			}

		}

		return {
			top: (

				// The absolute mouse position
				pageY -

				// Click offset (relative to the element)
				this.offset.click.top -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top +
				( ( this.cssPosition === "fixed" ?
					-this.scrollParent.scrollTop() :
					( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) )
			),
			left: (

				// The absolute mouse position
				pageX -

				// Click offset (relative to the element)
				this.offset.click.left -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left +
				( ( this.cssPosition === "fixed" ?
					-this.scrollParent.scrollLeft() :
					scrollIsRootNode ? 0 : scroll.scrollLeft() ) )
			)
		};

	},

	_rearrange: function( event, i, a, hardRefresh ) {

		a ? a[ 0 ].appendChild( this.placeholder[ 0 ] ) :
			i.item[ 0 ].parentNode.insertBefore( this.placeholder[ 0 ],
				( this.direction === "down" ? i.item[ 0 ] : i.item[ 0 ].nextSibling ) );

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout,
		// if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay( function() {
			if ( counter === this.counter ) {

				//Precompute after each DOM insertion, NOT on mousemove
				this.refreshPositions( !hardRefresh );
			}
		} );

	},

	_clear: function( event, noPropagation ) {

		this.reverting = false;

		// We delay all events that have to be triggered to after the point where the placeholder
		// has been removed and everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets
		// reappended (see #4088)
		if ( !this._noFinalSort && this.currentItem.parent().length ) {
			this.placeholder.before( this.currentItem );
		}
		this._noFinalSort = null;

		if ( this.helper[ 0 ] === this.currentItem[ 0 ] ) {
			for ( i in this._storedCSS ) {
				if ( this._storedCSS[ i ] === "auto" || this._storedCSS[ i ] === "static" ) {
					this._storedCSS[ i ] = "";
				}
			}
			this.currentItem.css( this._storedCSS );
			this._removeClass( this.currentItem, "ui-sortable-helper" );
		} else {
			this.currentItem.show();
		}

		if ( this.fromOutside && !noPropagation ) {
			delayedTriggers.push( function( event ) {
				this._trigger( "receive", event, this._uiHash( this.fromOutside ) );
			} );
		}
		if ( ( this.fromOutside ||
				this.domPosition.prev !==
				this.currentItem.prev().not( ".ui-sortable-helper" )[ 0 ] ||
				this.domPosition.parent !== this.currentItem.parent()[ 0 ] ) && !noPropagation ) {

			// Trigger update callback if the DOM position has changed
			delayedTriggers.push( function( event ) {
				this._trigger( "update", event, this._uiHash() );
			} );
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if ( this !== this.currentContainer ) {
			if ( !noPropagation ) {
				delayedTriggers.push( function( event ) {
					this._trigger( "remove", event, this._uiHash() );
				} );
				delayedTriggers.push( ( function( c ) {
					return function( event ) {
						c._trigger( "receive", event, this._uiHash( this ) );
					};
				} ).call( this, this.currentContainer ) );
				delayedTriggers.push( ( function( c ) {
					return function( event ) {
						c._trigger( "update", event, this._uiHash( this ) );
					};
				} ).call( this, this.currentContainer ) );
			}
		}

		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for ( i = this.containers.length - 1; i >= 0; i-- ) {
			if ( !noPropagation ) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if ( this.containers[ i ].containerCache.over ) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[ i ].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if ( this._storedOpacity ) {
			this.helper.css( "opacity", this._storedOpacity );
		}
		if ( this._storedZIndex ) {
			this.helper.css( "zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex );
		}

		this.dragging = false;

		if ( !noPropagation ) {
			this._trigger( "beforeStop", event, this._uiHash() );
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
		// it unbinds ALL events from the original node!
		this.placeholder[ 0 ].parentNode.removeChild( this.placeholder[ 0 ] );

		if ( !this.cancelHelperRemoval ) {
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if ( !noPropagation ) {
			for ( i = 0; i < delayedTriggers.length; i++ ) {

				// Trigger all delayed events
				delayedTriggers[ i ].call( this, event );
			}
			this._trigger( "stop", event, this._uiHash() );
		}

		this.fromOutside = false;
		return !this.cancelHelperRemoval;

	},

	_trigger: function() {
		if ( $.Widget.prototype._trigger.apply( this, arguments ) === false ) {
			this.cancel();
		}
	},

	_uiHash: function( _inst ) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $( [] ),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

} );


/*!
 * jQuery UI Spinner 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Spinner
//>>group: Widgets
//>>description: Displays buttons to easily input numbers via the keyboard or mouse.
//>>docs: http://api.jqueryui.com/spinner/
//>>demos: http://jqueryui.com/spinner/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/spinner.css
//>>css.theme: ../../themes/base/theme.css



function spinnerModifer( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.12.1",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		classes: {
			"ui-spinner": "ui-corner-all",
			"ui-spinner-down": "ui-corner-br",
			"ui-spinner-up": "ui-corner-tr"
		},
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {

		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// Only format if there is a value, prevents the field from being marked
		// as invalid in Firefox, see #9573.
		if ( this.value() !== "" ) {

			// Format the value, but don't constrain.
			this._value( this.element.val(), true );
		}

		this._draw();
		this._on( this._events );
		this._refresh();

		// Turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		} );
	},

	_getCreateOptions: function() {
		var options = this._super();
		var element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value != null && value.length ) {
				options[ option ] = value;
			}
		} );

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._stop();
			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( ( delta > 0 ? 1 : -1 ) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay( function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[ 0 ] === $.ui.safeActiveElement( this.document[ 0 ] ) ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[ 0 ] === $.ui.safeActiveElement( this.document[ 0 ] );
				if ( !isActive ) {
					this.element.trigger( "focus" );
					this.previous = previous;

					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay( function() {
						this.previous = previous;
					} );
				}
			}

			// Ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// Support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay( function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			} );

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget )
				.hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {

			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget )
				.hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},

		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	// Support mobile enhanced option and make backcompat more sane
	_enhance: function() {
		this.uiSpinner = this.element
			.attr( "autocomplete", "off" )
			.wrap( "<span>" )
			.parent()

				// Add buttons
				.append(
					"<a></a><a></a>"
				);
	},

	_draw: function() {
		this._enhance();

		this._addClass( this.uiSpinner, "ui-spinner", "ui-widget ui-widget-content" );
		this._addClass( "ui-spinner-input" );

		this.element.attr( "role", "spinbutton" );

		// Button bindings
		this.buttons = this.uiSpinner.children( "a" )
			.attr( "tabIndex", -1 )
			.attr( "aria-hidden", true )
			.button( {
				classes: {
					"ui-button": ""
				}
			} );

		// TODO: Right now button does not support classes this is already updated in button PR
		this._removeClass( this.buttons, "ui-corner-all" );

		this._addClass( this.buttons.first(), "ui-spinner-button ui-spinner-up" );
		this._addClass( this.buttons.last(), "ui-spinner-button ui-spinner-down" );
		this.buttons.first().button( {
			"icon": this.options.icons.up,
			"showLabel": false
		} );
		this.buttons.last().button( {
			"icon": this.options.icons.down,
			"showLabel": false
		} );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( this.uiSpinner.height() * 0.5 ) &&
				this.uiSpinner.height() > 0 ) {
			this.uiSpinner.height( this.uiSpinner.height() );
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay( function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false ) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// Make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;

		// - round to the nearest step
		aboveMin = Math.round( aboveMin / options.step ) * options.step;

		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// Fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// Clamp the value
		if ( options.max !== null && value > options.max ) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		var prevValue, first, last;

		if ( key === "culture" || key === "numberFormat" ) {
			prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}
		if ( key === "icons" ) {
			first = this.buttons.first().find( ".ui-icon" );
			this._removeClass( first, null, this.options.icons.up );
			this._addClass( first, null, value.up );
			last = this.buttons.last().find( ".ui-icon" );
			this._removeClass( last, null, this.options.icons.down );
			this._addClass( last, null, value.down );
		}

		this._super( key, value );
	},

	_setOptionDisabled: function( value ) {
		this._super( value );

		this._toggleClass( this.uiSpinner, null, "ui-state-disabled", !!value );
		this.element.prop( "disabled", !!value );
		this.buttons.button( value ? "disable" : "enable" );
	},

	_setOptions: spinnerModifer( function( options ) {
		this._super( options );
	} ),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr( {
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,

			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		} );
	},

	isValid: function() {
		var value = this.value();

		// Null is invalid
		if ( value === null ) {
			return false;
		}

		// If value gets adjusted, it's invalid
		return value === this._adjustValue( value );
	},

	// Update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.prop( "disabled", false )
			.removeAttr( "autocomplete role aria-valuemin aria-valuemax aria-valuenow" );

		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: spinnerModifer( function( steps ) {
		this._stepUp( steps );
	} ),
	_stepUp: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * this.options.step );
			this._stop();
		}
	},

	stepDown: spinnerModifer( function( steps ) {
		this._stepDown( steps );
	} ),
	_stepDown: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * -this.options.step );
			this._stop();
		}
	},

	pageUp: spinnerModifer( function( pages ) {
		this._stepUp( ( pages || 1 ) * this.options.page );
	} ),

	pageDown: spinnerModifer( function( pages ) {
		this._stepDown( ( pages || 1 ) * this.options.page );
	} ),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		spinnerModifer( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
} );

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for spinner html extension points
	$.widget( "ui.spinner", $.ui.spinner, {
		_enhance: function() {
			this.uiSpinner = this.element
				.attr( "autocomplete", "off" )
				.wrap( this._uiSpinnerHtml() )
				.parent()

					// Add buttons
					.append( this._buttonHtml() );
		},
		_uiSpinnerHtml: function() {
			return "<span>";
		},

		_buttonHtml: function() {
			return "<a></a><a></a>";
		}
	} );
}

var widgetsSpinner = $.ui.spinner;


/*!
 * jQuery UI Tabs 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Tabs
//>>group: Widgets
//>>description: Transforms a set of container elements into a tab structure.
//>>docs: http://api.jqueryui.com/tabs/
//>>demos: http://jqueryui.com/tabs/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/tabs.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.tabs", {
	version: "1.12.1",
	delay: 300,
	options: {
		active: null,
		classes: {
			"ui-tabs": "ui-corner-all",
			"ui-tabs-nav": "ui-corner-all",
			"ui-tabs-panel": "ui-corner-bottom",
			"ui-tabs-tab": "ui-corner-top"
		},
		collapsible: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// Callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_isLocal: ( function() {
		var rhash = /#.*$/;

		return function( anchor ) {
			var anchorUrl, locationUrl;

			anchorUrl = anchor.href.replace( rhash, "" );
			locationUrl = location.href.replace( rhash, "" );

			// Decoding may throw an error if the URL isn't UTF-8 (#9518)
			try {
				anchorUrl = decodeURIComponent( anchorUrl );
			} catch ( error ) {}
			try {
				locationUrl = decodeURIComponent( locationUrl );
			} catch ( error ) {}

			return anchor.hash.length > 1 && anchorUrl === locationUrl;
		};
	} )(),

	_create: function() {
		var that = this,
			options = this.options;

		this.running = false;

		this._addClass( "ui-tabs", "ui-widget ui-widget-content" );
		this._toggleClass( "ui-tabs-collapsible", null, options.collapsible );

		this._processTabs();
		options.active = this._initialActive();

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				} )
			) ).sort();
		}

		// Check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findActive( options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_initialActive: function() {
		var active = this.options.active,
			collapsible = this.options.collapsible,
			locationHash = location.hash.substring( 1 );

		if ( active === null ) {

			// check the fragment identifier in the URL
			if ( locationHash ) {
				this.tabs.each( function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationHash ) {
						active = i;
						return false;
					}
				} );
			}

			// Check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// No active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// Handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = collapsible ? false : 0;
			}
		}

		// Don't allow collapsible: false and active: false
		if ( !collapsible && active === false && this.anchors.length ) {
			active = 0;
		}

		return active;
	},

	_getCreateEventData: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getPanelForTab( this.active )
		};
	},

	_tabKeydown: function( event ) {
		var focusedTab = $( $.ui.safeActiveElement( this.document[ 0 ] ) ).closest( "li" ),
			selectedIndex = this.tabs.index( focusedTab ),
			goingForward = true;

		if ( this._handlePageNav( event ) ) {
			return;
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.RIGHT:
		case $.ui.keyCode.DOWN:
			selectedIndex++;
			break;
		case $.ui.keyCode.UP:
		case $.ui.keyCode.LEFT:
			goingForward = false;
			selectedIndex--;
			break;
		case $.ui.keyCode.END:
			selectedIndex = this.anchors.length - 1;
			break;
		case $.ui.keyCode.HOME:
			selectedIndex = 0;
			break;
		case $.ui.keyCode.SPACE:

			// Activate only, no collapsing
			event.preventDefault();
			clearTimeout( this.activating );
			this._activate( selectedIndex );
			return;
		case $.ui.keyCode.ENTER:

			// Toggle (cancel delayed activation, allow collapsing)
			event.preventDefault();
			clearTimeout( this.activating );

			// Determine if we should collapse or activate
			this._activate( selectedIndex === this.options.active ? false : selectedIndex );
			return;
		default:
			return;
		}

		// Focus the appropriate tab, based on which key was pressed
		event.preventDefault();
		clearTimeout( this.activating );
		selectedIndex = this._focusNextTab( selectedIndex, goingForward );

		// Navigating with control/command key will prevent automatic activation
		if ( !event.ctrlKey && !event.metaKey ) {

			// Update aria-selected immediately so that AT think the tab is already selected.
			// Otherwise AT may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedTab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedIndex ).attr( "aria-selected", "true" );

			this.activating = this._delay( function() {
				this.option( "active", selectedIndex );
			}, this.delay );
		}
	},

	_panelKeydown: function( event ) {
		if ( this._handlePageNav( event ) ) {
			return;
		}

		// Ctrl+up moves focus to the current tab
		if ( event.ctrlKey && event.keyCode === $.ui.keyCode.UP ) {
			event.preventDefault();
			this.active.trigger( "focus" );
		}
	},

	// Alt+page up/down moves focus to the previous/next tab (and activates)
	_handlePageNav: function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ) {
			this._activate( this._focusNextTab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ) {
			this._activate( this._focusNextTab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findNextTab: function( index, goingForward ) {
		var lastTabIndex = this.tabs.length - 1;

		function constrain() {
			if ( index > lastTabIndex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lastTabIndex;
			}
			return index;
		}

		while ( $.inArray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingForward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusNextTab: function( index, goingForward ) {
		index = this._findNextTab( index, goingForward );
		this.tabs.eq( index ).trigger( "focus" );
		return index;
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {

			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		this._super( key, value );

		if ( key === "collapsible" ) {
			this._toggleClass( "ui-tabs-collapsible", null, value );

			// Setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "heightStyle" ) {
			this._setupHeightStyle( value );
		}
	},

	_sanitizeSelector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// Get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		} );

		this._processTabs();

		// Was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();

		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {

			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();

			// activate previous tab
			} else {
				this._activate( this._findNextTab( Math.max( 0, options.active - 1 ), false ) );
			}

		// was active, active tab still exists
		} else {

			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setOptionDisabled( this.options.disabled );
		this._setupEvents( this.options.event );
		this._setupHeightStyle( this.options.heightStyle );

		this.tabs.not( this.active ).attr( {
			"aria-selected": "false",
			"aria-expanded": "false",
			tabIndex: -1
		} );
		this.panels.not( this._getPanelForTab( this.active ) )
			.hide()
			.attr( {
				"aria-hidden": "true"
			} );

		// Make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active
				.attr( {
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				} );
			this._addClass( this.active, "ui-tabs-active", "ui-state-active" );
			this._getPanelForTab( this.active )
				.show()
				.attr( {
					"aria-hidden": "false"
				} );
		}
	},

	_processTabs: function() {
		var that = this,
			prevTabs = this.tabs,
			prevAnchors = this.anchors,
			prevPanels = this.panels;

		this.tablist = this._getList().attr( "role", "tablist" );
		this._addClass( this.tablist, "ui-tabs-nav",
			"ui-helper-reset ui-helper-clearfix ui-widget-header" );

		// Prevent users from focusing disabled tabs via click
		this.tablist
			.on( "mousedown" + this.eventNamespace, "> li", function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventDefault();
				}
			} )

			// Support: IE <9
			// Preventing the default action in mousedown doesn't prevent IE
			// from focusing the element, so if the anchor gets focused, blur.
			// We don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.on( "focus" + this.eventNamespace, ".ui-tabs-anchor", function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			} );

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.attr( {
				role: "tab",
				tabIndex: -1
			} );
		this._addClass( this.tabs, "ui-tabs-tab", "ui-state-default" );

		this.anchors = this.tabs.map( function() {
			return $( "a", this )[ 0 ];
		} )
			.attr( {
				role: "presentation",
				tabIndex: -1
			} );
		this._addClass( this.anchors, "ui-tabs-anchor" );

		this.panels = $();

		this.anchors.each( function( i, anchor ) {
			var selector, panel, panelId,
				anchorId = $( anchor ).uniqueId().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalAriaControls = tab.attr( "aria-controls" );

			// Inline tab
			if ( that._isLocal( anchor ) ) {
				selector = anchor.hash;
				panelId = selector.substring( 1 );
				panel = that.element.find( that._sanitizeSelector( selector ) );

			// remote tab
			} else {

				// If the tab doesn't already have aria-controls,
				// generate an id by using a throw-away element
				panelId = tab.attr( "aria-controls" ) || $( {} ).uniqueId()[ 0 ].id;
				selector = "#" + panelId;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createPanel( panelId );
					panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length ) {
				that.panels = that.panels.add( panel );
			}
			if ( originalAriaControls ) {
				tab.data( "ui-tabs-aria-controls", originalAriaControls );
			}
			tab.attr( {
				"aria-controls": panelId,
				"aria-labelledby": anchorId
			} );
			panel.attr( "aria-labelledby", anchorId );
		} );

		this.panels.attr( "role", "tabpanel" );
		this._addClass( this.panels, "ui-tabs-panel", "ui-widget-content" );

		// Avoid memory leaks (#10056)
		if ( prevTabs ) {
			this._off( prevTabs.not( this.tabs ) );
			this._off( prevAnchors.not( this.anchors ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	// Allow overriding how to find the list for rare usage scenarios (#7715)
	_getList: function() {
		return this.tablist || this.element.find( "ol, ul" ).eq( 0 );
	},

	_createPanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.data( "ui-tabs-destroy", true );
	},

	_setOptionDisabled: function( disabled ) {
		var currentItem, li, i;

		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// Disable tabs
		for ( i = 0; ( li = this.tabs[ i ] ); i++ ) {
			currentItem = $( li );
			if ( disabled === true || $.inArray( i, disabled ) !== -1 ) {
				currentItem.attr( "aria-disabled", "true" );
				this._addClass( currentItem, null, "ui-state-disabled" );
			} else {
				currentItem.removeAttr( "aria-disabled" );
				this._removeClass( currentItem, null, "ui-state-disabled" );
			}
		}

		this.options.disabled = disabled;

		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null,
			disabled === true );
	},

	_setupEvents: function( event ) {
		var events = {};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			} );
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );

		// Always prevent the default action, even when disabled
		this._on( true, this.anchors, {
			click: function( event ) {
				event.preventDefault();
			}
		} );
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabKeydown" } );
		this._on( this.panels, { keydown: "_panelKeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupHeightStyle: function( heightStyle ) {
		var maxHeight,
			parent = this.element.parent();

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			maxHeight -= this.element.outerHeight() - this.element.height();

			this.element.siblings( ":visible" ).each( function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			} );

			this.element.children().not( this.panels ).each( function() {
				maxHeight -= $( this ).outerHeight( true );
			} );

			this.panels.each( function() {
				$( this ).height( Math.max( 0, maxHeight -
					$( this ).innerHeight() + $( this ).height() ) );
			} )
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.panels.each( function() {
				maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
			} ).height( maxHeight );
		}
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currentTarget ),
			tab = anchor.closest( "li" ),
			clickedIsActive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : this._getPanelForTab( tab ),
			toHide = !active.length ? $() : this._getPanelForTab( active ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : tab,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||

				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||

				// can't switch durning an animation
				this.running ||

				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||

				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedIsActive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			$.error( "jQuery UI Tabs: Mismatching fragment identifier." );
		}

		if ( toShow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventData );
	},

	// Handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			that._addClass( eventData.newTab.closest( "li" ), "ui-tabs-active", "ui-state-active" );

			if ( toShow.length && that.options.show ) {
				that._show( toShow, that.options.show, complete );
			} else {
				toShow.show();
				complete();
			}
		}

		// Start out by hiding, then showing, then completing
		if ( toHide.length && this.options.hide ) {
			this._hide( toHide, this.options.hide, function() {
				that._removeClass( eventData.oldTab.closest( "li" ),
					"ui-tabs-active", "ui-state-active" );
				show();
			} );
		} else {
			this._removeClass( eventData.oldTab.closest( "li" ),
				"ui-tabs-active", "ui-state-active" );
			toHide.hide();
			show();
		}

		toHide.attr( "aria-hidden", "true" );
		eventData.oldTab.attr( {
			"aria-selected": "false",
			"aria-expanded": "false"
		} );

		// If we're switching tabs, remove the old tab from the tab order.
		// If we're opening from collapsed state, remove the previous tab from the tab order.
		// If we're collapsing, then keep the collapsing tab in the tab order.
		if ( toShow.length && toHide.length ) {
			eventData.oldTab.attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.tabs.filter( function() {
				return $( this ).attr( "tabIndex" ) === 0;
			} )
				.attr( "tabIndex", -1 );
		}

		toShow.attr( "aria-hidden", "false" );
		eventData.newTab.attr( {
			"aria-selected": "true",
			"aria-expanded": "true",
			tabIndex: 0
		} );
	},

	_activate: function( index ) {
		var anchor,
			active = this._findActive( index );

		// Trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// Trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventHandler( {
			target: anchor,
			currentTarget: anchor,
			preventDefault: $.noop
		} );
	},

	_findActive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getIndex: function( index ) {

		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" +
				$.ui.escapeSelector( index ) + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.tablist
			.removeAttr( "role" )
			.off( this.eventNamespace );

		this.anchors
			.removeAttr( "role tabIndex" )
			.removeUniqueId();

		this.tabs.add( this.panels ).each( function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeAttr( "role tabIndex " +
					"aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded" );
			}
		} );

		this.tabs.each( function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li
					.attr( "aria-controls", prev )
					.removeData( "ui-tabs-aria-controls" );
			} else {
				li.removeAttr( "aria-controls" );
			}
		} );

		this.panels.show();

		if ( this.options.heightStyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				} );
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				} );
			}
		}
		this._setOptionDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setOptionDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getPanelForTab( tab ),
			eventData = {
				tab: tab,
				panel: panel
			},
			complete = function( jqXHR, status ) {
				if ( status === "abort" ) {
					that.panels.stop( false, true );
				}

				that._removeClass( tab, "ui-tabs-loading" );
				panel.removeAttr( "aria-busy" );

				if ( jqXHR === that.xhr ) {
					delete that.xhr;
				}
			};

		// Not remote
		if ( this._isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxSettings( anchor, event, eventData ) );

		// Support: jQuery <1.8
		// jQuery <1.8 returns false if the request is canceled in beforeSend,
		// but as of 1.8, $.ajax() always returns a jqXHR object.
		if ( this.xhr && this.xhr.statusText !== "canceled" ) {
			this._addClass( tab, "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.done( function( response, status, jqXHR ) {

					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout( function() {
						panel.html( response );
						that._trigger( "load", event, eventData );

						complete( jqXHR, status );
					}, 1 );
				} )
				.fail( function( jqXHR, status ) {

					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout( function() {
						complete( jqXHR, status );
					}, 1 );
				} );
		}
	},

	_ajaxSettings: function( anchor, event, eventData ) {
		var that = this;
		return {

			// Support: IE <11 only
			// Strip any hash that exists to prevent errors with the Ajax request
			url: anchor.attr( "href" ).replace( /#.*$/, "" ),
			beforeSend: function( jqXHR, settings ) {
				return that._trigger( "beforeLoad", event,
					$.extend( { jqXHR: jqXHR, ajaxSettings: settings }, eventData ) );
			}
		};
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
} );

// DEPRECATED
// TODO: Switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for ui-tab class (now ui-tabs-tab)
	$.widget( "ui.tabs", $.ui.tabs, {
		_processTabs: function() {
			this._superApply( arguments );
			this._addClass( this.tabs, "ui-tab" );
		}
	} );
}

var widgetsTabs = $.ui.tabs;


/*!
 * jQuery UI Tooltip 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Tooltip
//>>group: Widgets
//>>description: Shows additional information for any element on hover or focus.
//>>docs: http://api.jqueryui.com/tooltip/
//>>demos: http://jqueryui.com/tooltip/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/tooltip.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.tooltip", {
	version: "1.12.1",
	options: {
		classes: {
			"ui-tooltip": "ui-corner-all ui-widget-shadow"
		},
		content: function() {

			// support: IE<9, Opera in jQuery <1.7
			// .text() can't accept undefined, so coerce to a string
			var title = $( this ).attr( "title" ) || "";

			// Escape title, since we're going from an attribute to raw HTML
			return $( "<a>" ).text( title ).html();
		},
		hide: true,

		// Disabled elements have inconsistent behavior across browsers (#8661)
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		track: false,

		// Callbacks
		close: null,
		open: null
	},

	_addDescribedBy: function( elem, id ) {
		var describedby = ( elem.attr( "aria-describedby" ) || "" ).split( /\s+/ );
		describedby.push( id );
		elem
			.data( "ui-tooltip-id", id )
			.attr( "aria-describedby", $.trim( describedby.join( " " ) ) );
	},

	_removeDescribedBy: function( elem ) {
		var id = elem.data( "ui-tooltip-id" ),
			describedby = ( elem.attr( "aria-describedby" ) || "" ).split( /\s+/ ),
			index = $.inArray( id, describedby );

		if ( index !== -1 ) {
			describedby.splice( index, 1 );
		}

		elem.removeData( "ui-tooltip-id" );
		describedby = $.trim( describedby.join( " " ) );
		if ( describedby ) {
			elem.attr( "aria-describedby", describedby );
		} else {
			elem.removeAttr( "aria-describedby" );
		}
	},

	_create: function() {
		this._on( {
			mouseover: "open",
			focusin: "open"
		} );

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};

		// IDs of parent tooltips where we removed the title attribute
		this.parents = {};

		// Append the aria-live region so tooltips announce correctly
		this.liveRegion = $( "<div>" )
			.attr( {
				role: "log",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			} )
			.appendTo( this.document[ 0 ].body );
		this._addClass( this.liveRegion, null, "ui-helper-hidden-accessible" );

		this.disabledTitles = $( [] );
	},

	_setOption: function( key, value ) {
		var that = this;

		this._super( key, value );

		if ( key === "content" ) {
			$.each( this.tooltips, function( id, tooltipData ) {
				that._updateContent( tooltipData.element );
			} );
		}
	},

	_setOptionDisabled: function( value ) {
		this[ value ? "_disable" : "_enable" ]();
	},

	_disable: function() {
		var that = this;

		// Close open tooltips
		$.each( this.tooltips, function( id, tooltipData ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = tooltipData.element[ 0 ];
			that.close( event, true );
		} );

		// Remove title attributes to prevent native tooltips
		this.disabledTitles = this.disabledTitles.add(
			this.element.find( this.options.items ).addBack()
				.filter( function() {
					var element = $( this );
					if ( element.is( "[title]" ) ) {
						return element
							.data( "ui-tooltip-title", element.attr( "title" ) )
							.removeAttr( "title" );
					}
				} )
		);
	},

	_enable: function() {

		// restore title attributes
		this.disabledTitles.each( function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		} );
		this.disabledTitles = $( [] );
	},

	open: function( event ) {
		var that = this,
			target = $( event ? event.target : this.element )

				// we need closest here due to mouseover bubbling,
				// but always pointing at the same event target
				.closest( this.options.items );

		// No element to show a tooltip for or the tooltip is already open
		if ( !target.length || target.data( "ui-tooltip-id" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "ui-tooltip-open", true );

		// Kill parent tooltips, custom or native, for hover
		if ( event && event.type === "mouseover" ) {
			target.parents().each( function() {
				var parent = $( this ),
					blurEvent;
				if ( parent.data( "ui-tooltip-open" ) ) {
					blurEvent = $.Event( "blur" );
					blurEvent.target = blurEvent.currentTarget = this;
					that.close( blurEvent, true );
				}
				if ( parent.attr( "title" ) ) {
					parent.uniqueId();
					that.parents[ this.id ] = {
						element: this,
						title: parent.attr( "title" )
					};
					parent.attr( "title", "" );
				}
			} );
		}

		this._registerCloseHandlers( event, target );
		this._updateContent( target, event );
	},

	_updateContent: function( target, event ) {
		var content,
			contentOption = this.options.content,
			that = this,
			eventType = event ? event.type : null;

		if ( typeof contentOption === "string" || contentOption.nodeType ||
				contentOption.jquery ) {
			return this._open( event, target, contentOption );
		}

		content = contentOption.call( target[ 0 ], function( response ) {

			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			that._delay( function() {

				// Ignore async response if tooltip was closed already
				if ( !target.data( "ui-tooltip-open" ) ) {
					return;
				}

				// JQuery creates a special event for focusin when it doesn't
				// exist natively. To improve performance, the native event
				// object is reused and the type is changed. Therefore, we can't
				// rely on the type being correct after the event finished
				// bubbling, so we set it back to the previous value. (#8740)
				if ( event ) {
					event.type = eventType;
				}
				this._open( event, target, response );
			} );
		} );
		if ( content ) {
			this._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		var tooltipData, tooltip, delayedShow, a11yContent,
			positionOption = $.extend( {}, this.options.position );

		if ( !content ) {
			return;
		}

		// Content can be updated multiple times. If the tooltip already
		// exists, then just update the content and bail.
		tooltipData = this._find( target );
		if ( tooltipData ) {
			tooltipData.tooltip.find( ".ui-tooltip-content" ).html( content );
			return;
		}

		// If we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		//
		// We use removeAttr only for key events, to allow IE to export the correct
		// accessible attributes. For mouse events, set to empty string to avoid
		// native tooltip showing up (happens only when removing inside mouseover).
		if ( target.is( "[title]" ) ) {
			if ( event && event.type === "mouseover" ) {
				target.attr( "title", "" );
			} else {
				target.removeAttr( "title" );
			}
		}

		tooltipData = this._tooltip( target );
		tooltip = tooltipData.tooltip;
		this._addDescribedBy( target, tooltip.attr( "id" ) );
		tooltip.find( ".ui-tooltip-content" ).html( content );

		// Support: Voiceover on OS X, JAWS on IE <= 9
		// JAWS announces deletions even when aria-relevant="additions"
		// Voiceover will sometimes re-read the entire log region's contents from the beginning
		this.liveRegion.children().hide();
		a11yContent = $( "<div>" ).html( tooltip.find( ".ui-tooltip-content" ).html() );
		a11yContent.removeAttr( "name" ).find( "[name]" ).removeAttr( "name" );
		a11yContent.removeAttr( "id" ).find( "[id]" ).removeAttr( "id" );
		a11yContent.appendTo( this.liveRegion );

		function position( event ) {
			positionOption.of = event;
			if ( tooltip.is( ":hidden" ) ) {
				return;
			}
			tooltip.position( positionOption );
		}
		if ( this.options.track && event && /^mouse/.test( event.type ) ) {
			this._on( this.document, {
				mousemove: position
			} );

			// trigger once to override element-relative positioning
			position( event );
		} else {
			tooltip.position( $.extend( {
				of: target
			}, this.options.position ) );
		}

		tooltip.hide();

		this._show( tooltip, this.options.show );

		// Handle tracking tooltips that are shown with a delay (#8644). As soon
		// as the tooltip is visible, position the tooltip using the most recent
		// event.
		// Adds the check to add the timers only when both delay and track options are set (#14682)
		if ( this.options.track && this.options.show && this.options.show.delay ) {
			delayedShow = this.delayedShow = setInterval( function() {
				if ( tooltip.is( ":visible" ) ) {
					position( positionOption.of );
					clearInterval( delayedShow );
				}
			}, $.fx.interval );
		}

		this._trigger( "open", event, { tooltip: tooltip } );
	},

	_registerCloseHandlers: function( event, target ) {
		var events = {
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					var fakeEvent = $.Event( event );
					fakeEvent.currentTarget = target[ 0 ];
					this.close( fakeEvent, true );
				}
			}
		};

		// Only bind remove handler for delegated targets. Non-delegated
		// tooltips will handle this in destroy.
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			events.remove = function() {
				this._removeTooltip( this._find( target ).tooltip );
			};
		}

		if ( !event || event.type === "mouseover" ) {
			events.mouseleave = "close";
		}
		if ( !event || event.type === "focusin" ) {
			events.focusout = "close";
		}
		this._on( true, target, events );
	},

	close: function( event ) {
		var tooltip,
			that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltipData = this._find( target );

		// The tooltip may already be closed
		if ( !tooltipData ) {

			// We set ui-tooltip-open immediately upon open (in open()), but only set the
			// additional data once there's actually content to show (in _open()). So even if the
			// tooltip doesn't have full data, we always remove ui-tooltip-open in case we're in
			// the period between open() and _open().
			target.removeData( "ui-tooltip-open" );
			return;
		}

		tooltip = tooltipData.tooltip;

		// Disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( tooltipData.closing ) {
			return;
		}

		// Clear the interval for delayed tracking tooltips
		clearInterval( this.delayedShow );

		// Only set title if we had one before (see comment in _open())
		// If the title attribute has changed since open(), don't restore
		if ( target.data( "ui-tooltip-title" ) && !target.attr( "title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		this._removeDescribedBy( target );

		tooltipData.hiding = true;
		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			that._removeTooltip( $( this ) );
		} );

		target.removeData( "ui-tooltip-open" );
		this._off( target, "mouseleave focusout keyup" );

		// Remove 'remove' binding only on delegated targets
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			this._off( target, "remove" );
		}
		this._off( this.document, "mousemove" );

		if ( event && event.type === "mouseleave" ) {
			$.each( this.parents, function( id, parent ) {
				$( parent.element ).attr( "title", parent.title );
				delete that.parents[ id ];
			} );
		}

		tooltipData.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		if ( !tooltipData.hiding ) {
			tooltipData.closing = false;
		}
	},

	_tooltip: function( element ) {
		var tooltip = $( "<div>" ).attr( "role", "tooltip" ),
			content = $( "<div>" ).appendTo( tooltip ),
			id = tooltip.uniqueId().attr( "id" );

		this._addClass( content, "ui-tooltip-content" );
		this._addClass( tooltip, "ui-tooltip", "ui-widget ui-widget-content" );

		tooltip.appendTo( this._appendTo( element ) );

		return this.tooltips[ id ] = {
			element: element,
			tooltip: tooltip
		};
	},

	_find: function( target ) {
		var id = target.data( "ui-tooltip-id" );
		return id ? this.tooltips[ id ] : null;
	},

	_removeTooltip: function( tooltip ) {
		tooltip.remove();
		delete this.tooltips[ tooltip.attr( "id" ) ];
	},

	_appendTo: function( target ) {
		var element = target.closest( ".ui-front, dialog" );

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_destroy: function() {
		var that = this;

		// Close open tooltips
		$.each( this.tooltips, function( id, tooltipData ) {

			// Delegate to close method to handle common cleanup
			var event = $.Event( "blur" ),
				element = tooltipData.element;
			event.target = event.currentTarget = element[ 0 ];
			that.close( event, true );

			// Remove immediately; destroying an open tooltip doesn't use the
			// hide animation
			$( "#" + id ).remove();

			// Restore the title
			if ( element.data( "ui-tooltip-title" ) ) {

				// If the title attribute has changed since open(), don't restore
				if ( !element.attr( "title" ) ) {
					element.attr( "title", element.data( "ui-tooltip-title" ) );
				}
				element.removeData( "ui-tooltip-title" );
			}
		} );
		this.liveRegion.remove();
	}
} );

// DEPRECATED
// TODO: Switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for tooltipClass option
	$.widget( "ui.tooltip", $.ui.tooltip, {
		options: {
			tooltipClass: null
		},
		_tooltip: function() {
			var tooltipData = this._superApply( arguments );
			if ( this.options.tooltipClass ) {
				tooltipData.tooltip.addClass( this.options.tooltipClass );
			}
			return tooltipData;
		}
	} );
}

var widgetsTooltip = $.ui.tooltip;




}));