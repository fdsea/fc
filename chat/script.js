var FAKE_MESSAGES = [
  {
    type: 'self',
    payload: {
      letter: 'S',
      message: 'dsafssssssssssssssssssssadffffffffffffffffffffsafffssssssssssssssffffffsssssssssssssssssssffffffffsadddddddddsfffffffffffffffffffffffffssssssssssssssssssssssssssfffffffffsafsssssssssssssssssssssssssssssssssssddsassssaaaaaaaaaaasaaaaaaaad',
      time: '15.00'
    }
  },
  {
    type: 'self',
    payload: {
      letter: 'S',
      message: 'sssssddsassssaaaaaaaaaaasaaaaaaaad',
      time: '15.01'
    }
  },
  {
    type: 'partner',
    payload: {
      letter: 'P',
      message: 'sssssddsassssaaaaaaaaaaasaaaaaaaad asdasd',
      time: '15.01'
    }
  },
  {
    type: 'self',
    payload: {
      letter: 'S',
      message: 'asdasd',
      time: '15.31'
    }
  }
];

var FAKE_CONTACTS = [
  {
    letter: 'A',
    username: 'tester_huester_a'
  },
  {
    letter: 'B',
    username: 'tester_huester_b'
  },
  {
    letter: 'C',
    username: 'tester_huester_c'
  },
  {
    letter: 'A',
    username: 'tester_huester_a'
  }
];

!function(t,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():t.ActionController=e()}(this,function(){"use strict";function t(t,e){this.currentElement=null,this.actions=e||{},this.attr=t,this.events=["click","input","change"],this.checkers={},this.checker=this.checker.bind(this),this.init()}return t.prototype.$attr=function(t){return this.el.getAttribute(t)},t.prototype.$val=function(){return this.event.target.value},t.prototype.checkElement=function(t){return t.getAttribute(this.attr)?{link:t,name:t.getAttribute(this.attr)}:{link:t.closest("["+this.attr+"]"),name:t.closest("["+this.attr+"]")?t.closest("["+this.attr+"]").getAttribute(this.attr):null}},t.prototype.add=function(t){for(var e in t)t.hasOwnProperty(e)&&(this.actions[e]=t[e],this.actions[e].$attr=this.$attr.bind(this.actions[e]),this.actions[e].$val=this.$val.bind(this.actions[e]))},t.prototype.checker=function(t){var e=this,n=t||"click";return function(t){e.currentElement;var i=e.currentElement=e.checkElement(t.target),r=e.actions[i.name];if(!i||!r||(r.type||"click")!==n)return!1;r.event=t,r.el=i.link,r.name=i.name,r.action({event:t,el:i.link,name:i.name})}},t.prototype.setListeners=function(){var t=this;t.events.forEach(function(e){var n=t.checker(e);t.checkers[e+"controller"]={listener:n,event:e},document.addEventListener(e,t.checkers[e+"controller"].listener)})},t.prototype.removetListeners=function(){if(!this.checkers.length)return!1;this.checkers.forEach(function(t){document.addEventListener(t.event,t.listener)})},t.prototype.init=function(){this.removetListeners(),this.setListeners()},t});

(function() {
  var $ = function(selector) {
    return document.querySelector(selector);
  };

  var contacts = $('.contacts-list');
  var contactsContainer = $('.contacts-container');
  var chatroom = $('.chat-room');
  var field = $('.chat-field');
  var action = $('.chat-action');

  var userLetterID = 'S';

  var setFakeMessageAfterSuccessRequest = true;

  window.$controller$ = new ActionController('data-controller', {});

  /*
  * IMessagePayload = {letter: string; message: string; time: string}
  * TMessage = self | partner
  * IContact = {letter: string; username: string};
  *
  * */
  var CHAT = {
    getContactMarkup: function(payload/*IContact*/) {
      return '<div class="contact" data-controller="contact" data-contact-id="'+ payload.username +'">' +
        '<div class="contact__inner">' +
        '   <div class="contact__avatar">' +
        '     <span>'+ payload.letter +'</span>' +
        '   </div>\n' +
        '   <div class="contact__info">' +
        '      <span>'+ payload.username +'</span>' +
        '    </div>' +
        '    </div>' +
        '</div>'
    },
    getMessageMarkup: function (
      type, /* TMessage */
      payload /* IMessagePayload */
    ) {
      var typeClass = type === 'self'
        ? 'dialog__message-containter__message_myself'
        : 'dialog__message-containter__message_companion';
      var textContainerClass = type === 'self'
        ? 'dialog__message__text-container_myself'
        : 'dialog__message__text-container_companion'
      return '<div class="dialog__message-containter__message '+ typeClass +'">' +
        '            <div class="dialog__message__avatar">' +
        '                <div class="avatar-plug">'+ payload.letter +'</div>' +
        '            </div>' +
        '            <div class="dialog__message__text-container '+ textContainerClass +'">' +
        '                ' + payload.message +
        '                <div class="dialog__message__text-container__time">'+ payload.time +'</div>' +
        '            </div>\n' +
        '        </div>'
    },

    getAllMessagesMarkup: function(list /*array<{payload: IMessagePayload, type: TMessage}>*/, creator) {
      return list.map(function(message) {
        return creator(message.type, message.payload);
      }).join('');
    },

    getAllContactsMarkup: function(list/*array<IContact>*/, creator) {
      return list.map(function(contact) {
        return creator(contact);
      }).join('');
    },

    /*** MESSAGES ***/
    setMarkupOnChatRoom(markup /* string */) {
      chatroom.insertAdjacentHTML('beforeend', markup);
    },
    setAvailability: function(status) {
      action.disabled = !status;
    },
    sendMessage: function(message) { // fake request

      return new Promise(function(res) {
        /*
         *
         * socket.emit('message', message, function() {
         *   res();
         * })
         *
        * */
        setTimeout(function() {
          res();
        }, 1000)
      })
    },
    getCurrentTime: function() {
      return new Date().getHours() + ':' + new Date().getMinutes();
    },
    setMessageOnChatRoom: function(message) {
      var date = CHAT.getCurrentTime();
      var markup = CHAT.getMessageMarkup('self', {
        letter: userLetterID,
        message: message,
        time: date
      });
      CHAT.setMarkupOnChatRoom(markup);
    },
    clearField: function() {
      field.value = '';
    },
    /******/
    /*** CONTACTS ***/
    setMarkupOnContactsList(markup /* string */) {
      contacts.insertAdjacentHTML('beforeend', markup);
    },
    /****************/
    init: function() {
      CHAT.loadContacts(FAKE_CONTACTS);
      CHAT.controller();
    },
    controller: function() {
      $controller$.add({
        "contact": {
          action: function () {
            var id = this.$attr('data-contact-id');

            /*тут получать мессаги по id*/
            CHAT.loadMessages(FAKE_MESSAGES);
            CHAT.hideContactsList();
          }
        },
        "chat-action": {
          action: function() {
            var message = field.value;
            CHAT.setAvailability(false)
            CHAT.sendMessage(message)
              .then(function() {
                CHAT.setMessageOnChatRoom(message);
                CHAT.clearField();

                if(setFakeMessageAfterSuccessRequest) {
                  setTimeout(function() {
                    CHAT.for_test_IncomingMessage({
                      message: 'message: ' + Math.random(),
                      time: CHAT.getCurrentTime(),
                      letter: 'R'
                    })
                  }, 1000);
                }
              })
              .finally(() => {
                CHAT.setAvailability(true)
              })
          }
        },
        "back-to-contact-list": {
          action: function() {
            CHAT.openContactsList();
          }
        }
      });
    },
    hideContactsList() {
      contactsContainer.classList.remove('contacts--open');
    },
    openContactsList() {
      contactsContainer.classList.add('contacts--open');
    },
    scrollToTop: function() {
      chatroom.scrollTop = chatroom.scrollHeight;
    },
    loadMessages: function(messagesList) {
      /*
      * Тут надо дернуть список мессаг примерно так
      * socket.on('messages', function(list) {
      *     var m = CHAT.getAllMessagesMarkup(messagesList, CHAT.getMessageMarkup);
      *     CHAT.setMarkupOnChatRoom(m);
      *     CHAT.scrollToTop();
      * })
      * */
      setTimeout(function () {
        var m = CHAT.getAllMessagesMarkup(messagesList, CHAT.getMessageMarkup);
        CHAT.setMarkupOnChatRoom(m);
        CHAT.scrollToTop();
      }, 2000);
    },
    loadContacts: function(contacts /*IContact*/) {

      /*
      * Тут надо дернуть список контактов примерно так
      * socket.on('contacts', function(list) {
      *     var c = CHAT.getAllContactsMarkup(list, CHAT.getContactMarkup);
      *     CHAT.setMarkupOnContactsList(c);
      * })
      * */

      setTimeout(function() {
        var c = CHAT.getAllContactsMarkup(contacts, CHAT.getContactMarkup);
        CHAT.setMarkupOnContactsList(c);
      }, 1000)
    },
    for_test_IncomingMessage(payload /* IMessagePayload */) {
      /*
      * Это примерный способ как сунуть мессагу в чат
      * socket.on('income-message', function(payload) {
             var markup = CHAT.getMessageMarkup('partner', {
              letter: payload.letter,
              message: payload.message,
              time: payload.time
            });
            CHAT.setMarkupOnChatRoom(markup);
      * })
      * */
      var markup = CHAT.getMessageMarkup('partner', {
        letter: payload.letter,
        message: payload.message,
        time: payload.time
      });
      CHAT.setMarkupOnChatRoom(markup);
    }
  }

  CHAT.init();
} ());