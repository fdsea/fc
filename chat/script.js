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

(function() {
  var $ = function(selector) {
    return document.querySelector(selector);
  };

  var chatroom = $('.chat-room');
  var field = $('.chat-field');
  var action = $('.chat-action');

  var userLetterID = 'S';

  var setFakeMessageAfterSuccessRequest = true;

  /*
  * IMessagePayload = {letter: string; message: string; time: string}
  * TMessage = self | partner
  *
  * */
  var CHAT = {
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
    getAllMessagesMarkup: function(list /*array<{payload: IMessagePayload, type: TMessage}>*/) {
      return list.map(function(message) {
        return CHAT.getMessageMarkup(message.type, message.payload);
      }).join('');
    },
    setMarkupOnChatRoom(markup /* string */) {
      chatroom.insertAdjacentHTML('beforeend', markup);
    },
    /******/
    setAvailability: function(status) {
      action.disabled = !status;
    },
    sendMessage: function(message) { // fake request
      return new Promise(function(res) {
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
    init: function() {
      CHAT.loadMessages(FAKE_MESSAGES);
      CHAT.controller();
    },
    controller: function() {
      action.addEventListener('click', function() {
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
      });
    },
    loadMessages(loadMessages) {
      setTimeout(function () {
        var m = CHAT.getAllMessagesMarkup(loadMessages)
        console.log(m)
        CHAT.setMarkupOnChatRoom(m)
      }, 2000);
    },
    for_test_IncomingMessage(payload /* IMessagePayload */) {
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