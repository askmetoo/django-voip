{% load i18n %}
{% autoescape off %}
var providers_large = {
    openid: {
        name: "OpenID",     
        label: "{% trans 'Eneter your OpenID identifier.' %}",
        url: null
     },
    yahoo: {
        name: 'Yahoo',      
        link: '{% url socialauth.views.yahoo_login %}'
    },    
    aol: {
        name: 'AOL',
        label: "{% trans 'Enter AOL username' %}",
        url: 'http://openid.aol.com/{username}/'
    },
    linkedin: {
        name: 'Linkedin',     
        link: '{% url socialauth.views.linkedin_login %}'
    },
    twitter: {
        name: 'Twitter',     
        link: '{% url socialauth.views.twitter_login %}'
    },
    google: {
        name: 'Google',
        link: '{% url socialauth.views.google_login %}'
    },
    facebook: {
        name: 'Facebook',     
        link: '{% url socialauth.views.facebook_login %}'
    },
    cloudpub: {
        name: 'CloudPub',
        form: '{% url socialauth.views.login_page %}',
        label: "{% trans 'Enter your CloudPub login and password' %}",
    }
 };
var providers_small = {
    myopenid: {
        name: 'MyOpenID',
        label: 'Введите имя пользователя MyOpenID',
        url: 'http://{username}.myopenid.com/'
    },
    livejournal: {
        name: 'LiveJournal',
        label: 'Введите имя пользователя LiveJournal',
        url: 'http://{username}.livejournal.com/'
    },
    flickr: {
        name: 'Flickr',        
        label: 'Введите имя пользователя Flickr',
        url: 'http://flickr.com/photos/{username}/'
    },
    technorati: {
        name: 'Technorati',
        label: 'Enter your Technorati username.',
        url: 'http://technorati.com/people/technorati/{username}/'
    },
    wordpress: {
        name: 'Wordpress',
        label: 'Enter your Wordpress.com username.',
        url: 'http://{username}.wordpress.com/'
    },
    blogger: {
        name: 'Blogger',
        label: 'Your Blogger account',
        url: 'http://{username}.blogspot.com/'
    },
    verisign: {
        name: 'Verisign',
        label: 'Your Verisign username',
        url: 'http://{username}.pip.verisignlabs.com/'
    },
    vidoop: {
        name: 'Vidoop',
        label: 'Your Vidoop username',
        url: 'http://{username}.myvidoop.com/'
    },
    verisign: {
        name: 'Verisign',
        label: 'Your Verisign username',
        url: 'http://{username}.pip.verisignlabs.com/'
    },
    claimid: {
        name: 'ClaimID',
        label: 'Your ClaimID username',
        url: 'http://claimid.com/{username}'
    }
};

var providers = $.extend({}, providers_large, providers_small);

var openid = {
	cookie_expires: 6*30,	// 6 months.
	cookie_name: 'openid_provider',
	cookie_path: '/',
	img_path: '/site_media/img/social/',
	input_id: null,
	provider_url: null,
	
    init: function(input_id) {
        var openid_btns = $('#openid_btns');
        this.input_id = input_id;
        $('#openid_choice').show();
        $('#openid_input_area').empty();
        for (id in providers_large) {
           	openid_btns.prepend(this.getBoxHTML(providers_large[id], 'large', '.gif'));
        }
       	openid_btns.append('<br/>');
        for (id in providers_small) {
	       	openid_btns.append(this.getBoxHTML(providers_small[id], 'small', '.ico'));
        }
        $('#openid_form').submit(this.submit);
        var box_id = this.readCookie();
        if (box_id) {
        	this.signin(box_id, true);
        }  
    },
    getBoxHTML: function(provider, box_size, image_ext) {
        var box_id = provider["name"].toLowerCase();
        var html = '<a title="' + provider["name"] + '"';
	if( provider["link"] ) {
		html += " href='" + provider["link"] + "' target='_top'";
 		html += ' onclick="openid.signin(\'' + box_id + '\');"';
	}
 			  else html += ' href="javascript:openid.signin(\'' + box_id + '\');"';
	html += ' class="' + box_id + ' openid_' + box_size + '_btn"></a>';
	return html;
    },
    /* Provider image click */
    signin: function(box_id, onload) {
    	var provider = providers[box_id];
  		if (! provider) {
  			return;
  		}
		
		this.highlight(box_id);
		this.setCookie(box_id);
		this.provider_url = provider['url'];
		// prompt user for input?
		if (provider['label']) {
			this.useInputBox(provider);
		} else {
			this.setOpenIdUrl(provider['url']);
			if (!onload) {
				$('#openid_form').submit();
   				$('#openid_form').hide();
				$('#wait_image').show();
			}
	}
    },


    /* Sign-in button click */
    submit: function() {
        var url = openid.provider_url; 
    	if (url) {
    		url = url.replace('{username}', $('#openid_username').val());
    		openid.setOpenIdUrl(url);
    	}
    	$('#openid_form').hide();
	$('#wait_image').show();
	return true;
    },
    setOpenIdUrl: function (url) {
    	var hidden = $('#'+this.input_id);
    	if (hidden.length > 0) {
    		hidden.attr('value', url);
    	} else {
    		$('#openid_form').append('<input type="hidden" id="' + this.input_id + '" name="' + this.input_id + '" value="'+url+'"/>');
    	}
    },
    highlight: function (box_id) {
    	$('.openid_highlight').removeClass('openid_highlight');
    	$('.'+box_id).addClass('openid_highlight');
    },
    setCookie: function (value) {
    
		var date = new Date();
		date.setTime(date.getTime()+(this.cookie_expires*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
		
		document.cookie = this.cookie_name+"="+value+expires+"; path=" + this.cookie_path;
    },
    readCookie: function () {
		var nameEQ = this.cookie_name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
    },
    useInputBox: function (provider) {
		var input_area = $('#openid_input_area');
		var html = '';
		var id = 'openid_username';
		var value = '';
		var label = provider['label'];
		var style = '';
		
		if (label) {
			html = '<p>' + label + '</p>';
		}
		var form = $('#openid_form'); 
		if (provider['form']) {
			form.attr('method','post');
			form.attr('target','_self');
			form.get(0).setAttribute('action',provider['form'] + '{{ request.urlstate }}'); // get(0) is JQuery bug workaround
			html += '<input id="id_username" name="username"/><input name="password" type="password"/>';
			id = "id_username";
		}
		else
		{
			form.attr('method','get');
			form.attr('target','_top');
			form.get(0).setAttribute('action','{% url socialauth.views.openid_login %}{{ request.urlstate }}');
			if (provider['name'] == 'OpenID') {
				id = this.input_id;
				value = 'http://';
				style = 'background:#FFF url('+this.img_path+'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
			}
			html += '<input id="'+id+'" type="text" style="'+style+'" name="'+id+'" value="'+value+'" />';
		}
	        html += '<input id="openid_submit" type="submit" value="Sign-In"/>';
		input_area.empty();
		input_area.append(html);
		$('#'+id).focus();
    }
};
{% endautoescape %}
