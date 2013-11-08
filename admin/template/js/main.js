/*✓*/
$(document).ready(function(){
	header_height = $('#menu').height()
	$('#menu').css('height','50px')
	if(getCookie('menu')!='click'){$('#menu').hoverIntent(makeTall,makeShort)}
	$('#menu').click(function(){makeTall();$('#menuclick').show()})
	$('#menuclick').click(function(){makeShort();$('#menuclick').hide()})
	$('.ids').enableCheckboxRangeSelection();
	notify(getCookie('messText'),getCookie('messStatus'))
	$(document).on('click','.skin-selector a',function(){var skin=$(this).attr('title');$('#skin').attr('href','template/css/skin/'+skin+'.css');setCookie('skin',skin,7);return false})

	$('#keys').change(function(){$('#key').val($(this).val()).change()})/*meta plugin*/
	$('#checkall').click(function(){if($(this).prop('checked')){$('.ids').prop('checked',true)}else{$('.ids').prop('checked',false)}})
	$('#fullpath').click(function(){$('.table').toggleClass('hideLinks')})/*TODO засунуть в "нажми меня"?*/
	$('#fulltree').click(function(){if($(this).attr('checked')){setCookie('fullTree',1,7)}else{setCookie('fullTree', null, -1)};window.location.reload()})
	$('body').tooltip({selector:'[data-toggle=tooltip]'})
	$("[data-toggle=popover]").popover({html:true})
	$('.siteselect').change(function(){location.href = '?'+apdQS($(this).val())})
	$('.ajaxmodal').click(function(){$.ajax({type:'GET',url:$(this).data('url')+'&ajax='+token})})
	$(document).on('click','#modal-save',function(){$.ajax({type:'POST',url:$('#modal-form').prop('action')+'&ajax='+token,data:$('#modal-form').serialize()})})
	$('#other').change(function(){location.href = $(this).data('url') + $(this).val()})
	$('.submit').click(function(){sendForm($(this).data('act'))})
})

$(document).ajaxSend(function(){
	$('html').css('cursor', 'wait')
}).ajaxSuccess(function(e, xhr, settings){
	console.log(xhr.responseText)
	window.respond = $.parseJSON(xhr.responseText)
	if ('success' in window.respond){notify(window.respond.success, 'success')}
	else if ('error' in window.respond){notify(window.respond.error, 'error')}
	if ('modal' in window.respond){showModal(window.respond.modal)}
	if ('reload' in window.respond){window.location.reload()}
	if ('redirect' in window.respond){location.href = window.respond.redirect}
}).ajaxError(function(){
	$('html').css('cursor', 'auto')
	notify('AJAX 404 (Not Found)', 'error')
}).ajaxComplete(function(){
	$('html').css('cursor', 'auto')
})
var ua = navigator.userAgent.toLowerCase(), isIE = (ua.indexOf("msie") != -1 && ua.indexOf("opera") == -1), isSafari = ua.indexOf("safari") != -1, isGecko = (ua.indexOf("gecko") != -1 && !isSafari);
if (isIE || isSafari){addHandler(document, "keydown", hotSave)} else {addHandler(document, "keypress", hotSave)}

function apdQS(str){if(location.search){var arr=getQS(location.search);$.extend(arr,getQS('?'+str));return $.param(arr)}else{return str}}
function getQS(str){var qs=str.slice(1).split('&'),argsParsed={};for(i=0;i<qs.length;i++){arg=unescape(qs[i]);if(arg.indexOf('=')==-1){argsParsed[arg.trim()]=true}else{kvp=arg.split('=');argsParsed[kvp[0].trim()]=kvp[1].trim()}}return argsParsed}
function makeTall(){$('#menu').animate({"height":header_height},150)}
function makeShort(){$('#menu').animate({"height":50},150)}
function setCookie(n,v,x){var d=new Date();d.setDate(d.getDate()+x);var e=escape(v)+((x==null)?"":"; expires="+d.toUTCString());document.cookie=n+"="+e;}
function getCookie(n){var i,x,y,arr=document.cookie.split(';');for(i=0;i<arr.length;i++){x=arr[i].substr(0,arr[i].indexOf('='));y=arr[i].substr(arr[i].indexOf('=')+1);x=x.replace(/^\s+|\s+$/g,'');if(x==n){return decodeURI(y.replace(/\+/g,' '))}}}
function notify(m,s){if(m != null){$('#notify').append($('<li class="'+s+'"></li>').html(m).delay(3000).slideUp());setCookie('messText', null, -1)}}
function showModal(data){var out=$('#modal-blank').html().replace(/-bln/g,'').replace('{{title}}',data.title).replace('{{content}}',data.content).replace('{{form_url}}',data.form_url);$('#for-modal').html(out);$('#modal').modal('show')}
function sendForm(p){if(p=='save'){document.form.action += '&goto=view'} $('.content').submit();}
function addHandler(object, event, handler, useCapture) {if (object.addEventListener)object.addEventListener(event, handler, useCapture);else if (object.attachEvent)object.attachEvent('on' + event, handler);else object['on' + event] = handler;}
function hotSave(evt){evt = evt || window.event;var key = evt.keyCode || evt.which;key = !isGecko ? (key == 83 ? 1 : 0) : (key == 115 ? 1 : 0);if (evt.ctrlKey && key){if(evt.preventDefault) evt.preventDefault();evt.returnValue = false;sendForm('apply');window.focus();return false;}}