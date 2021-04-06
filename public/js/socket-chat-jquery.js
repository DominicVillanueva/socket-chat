var params = new URLSearchParams(window.location.search);

var name = params.get('name');
var room = params.get('room');

// References jquery
var divUsuarios = $('#divUsuarios');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderUsers(peoples = []) {
    console.log(peoples);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span>' + room + '</span></a>';
    html += '</li>';

    for(var i = 0; i < peoples.length; i++) {
        html += '<li>'
        html += '   <a data-id="'+ peoples[i].id +'" href="javascript:void(0)"><img src="assets/images/users/'+(i+1)+'.jpg" alt="user-img" class="img-circle"> <span>'+ peoples[i].name +'<small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsuarios.html(html);
}

// Renderizar mensajes
function renderMessages(data, me) {
    var html = '';
    var date = new Date(data.date);
    var hora = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';
    if(data.name === 'Administrador') {
        adminClass = 'danger'
    }

    if(me) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ data.name +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ data.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';

        if(data.name !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ data.name +'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+ data.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Onclick de cada usuario
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if(id) {
        console.log(id);
    }
});

formSend.on('submit', function(e) {
    e.preventDefault();
    if(txtMessage.val().trim().length === 0) return;

    socket.emit('createdMessage', {
        name,
        message: txtMessage.val(),
    }, function(message) {
        // console.log('respuesta server: ', message);
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
});
