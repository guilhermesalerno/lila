var k = Mousetrap;
var control = require('./control');
var m = require('mithril');

function preventing(f) {
  return function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      // internet explorer
      e.returnValue = false;
    }
    f();
  };
}

module.exports = {
  bind: function(ctrl) {
    k.bind(['left', 'k'], preventing(function() {
      control.prev(ctrl);
      m.redraw();
    }));
    k.bind(['shift+left', 'shift+k'], preventing(function() {
      control.exitVariation(ctrl);
      m.redraw();
    }));
    k.bind(['right', 'j'], preventing(function() {
      if (!ctrl.fork.proceed()) control.next(ctrl);
      m.redraw();
    }));
    k.bind(['shift+right', 'shift+j'], preventing(function() {
      control.enterVariation(ctrl);
      m.redraw();
    }));
    k.bind(['up', '0'], preventing(function() {
      if (!ctrl.fork.prev()) control.first(ctrl);
      m.redraw();
    }));
    k.bind(['down', '$'], preventing(function() {
      if (!ctrl.fork.next()) control.last(ctrl);
      m.redraw();
    }));
    k.bind('shift+c', preventing(function() {
      ctrl.vm.comments = !ctrl.vm.comments;
      ctrl.autoScroll();
      m.redraw();
    }));
    k.bind('esc', ctrl.chessground.cancelMove);
    k.bind('f', preventing(ctrl.flip));
    k.bind('/', preventing(function() {
      $('#chat input.lichess_say').focus();
    }));
    k.bind('?', preventing(function() {
      ctrl.vm.keyboardHelp = !ctrl.vm.keyboardHelp;
      m.redraw();
    }));
    k.bind('l', preventing(function() {
      $('#analyse-toggle-ceval').click();
    }));
    k.bind('a', preventing(function() {
      ctrl.toggleAutoShapes(!ctrl.vm.showAutoShapes());
      m.redraw();
    }));
    k.bind('e', preventing(function() {
      ctrl.explorer.toggle();
      m.redraw();
    }));
    if (ctrl.study) {
      k.bind('c', preventing(function() {
        $('.study_buttons a.comment').click();
      }));
      k.bind('s', preventing(function() {
        $('.study_buttons a.glyph').click();
      }));
    }
  },
  view: function(ctrl) {
    var header = function(text) {
      return m('tr', m('th[colspan=2]', m('p', text)));
    };
    var row = function(keys, desc) {
      return m('tr', [
        m('td.keys', keys),
        m('td.desc', desc)
      ]);
    };
    var k = function(key) {
      return m('kbd', key);
    }
    var or = m('or', '/');

    return m('div.lichess_overboard.keyboard_help', {
      config: function(el, isUpdate) {
        if (!isUpdate) lichess.loadCss('/assets/stylesheets/keyboard.css');
      }
    }, [
      m('a.close.icon[data-icon=L]', {
        onclick: function() {
          ctrl.vm.keyboardHelp = false;
        }
      }),
      m('h2', 'Keyboard shortcuts'),
      m('table', m('tbody', [
        header('Navigate the move tree'),
        row([k('←'), or, k('→')], ctrl.trans('keyMoveBackwardOrForward')),
        row([k('j'), or, k('k')], ctrl.trans('keyMoveBackwardOrForward')),
        row([k('↑'), or, k('↓')], ctrl.trans('keyGoToStartOrEnd')),
        row([k('0'), or, k('$')], ctrl.trans('keyGoToStartOrEnd')),
        row([k('shift'), k('←'), or, k('shift'), k('→')], ctrl.trans('keyEnterOrExitVariation')),
        row([k('shift'), k('j'), or, k('shift'), k('k')], ctrl.trans('keyEnterOrExitVariation')),
        header('Analysis options'),
        row([k('l')], 'Local computer analysis'),
        row([k('a')], 'Computer arrows'),
        row([k('e')], 'Opening/endgame explorer'),
        row([k('/')], 'Focus chat'),
        row([k('shift'), k('c')], ctrl.trans('keyShowOrHideComments')),
        row([k('?')], 'Show this help dialog'),
        ctrl.study ? [
          header('Study actions'),
          row([k('c')], 'Comment this position'),
          row([k('s')], 'Annotate with symbols')
        ] : null
      ]))
    ]);
  }
};
