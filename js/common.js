var globalUrl = "http://192.168.8.204:8001";
var isLogin = "false";//登录状态
//处理

$(document).ready(function(){
	//检测sessionStorage是否登录
	isLogin = sessionStorage.getItem("isLogin");
	//处理头部方法导航栏，初始化
	headerInit();
	//登录注销后样式改动
	stateChange();
	//绑定登录事件
	$(".phone-login").click(function(){
		login();
	})
	//绑定注册事件
	$(".phone-register").click(function(){
		register();
	})
	//绑定发送验证码事件
	$(".sendCode").click(function(){
		sendCode();
	})
	$(".sendCodeReset").click(function(){
		sendCode("reset");
	})
	$(".phone-resetPassword").click(function(){
		resetPassword();
	})

	//swiper 初始化
	if($(".swiper-container").length>=1){
		var swiper = new Swiper('.swiper-container', {
			scrollbar: {
			el: '.swiper-scrollbar',
			hide: false,
			},
			navigation: {
				nextEl: '.notice-right',
				prevEl: '.notice-left',
			},
		});
	}

	//分配item
	if($(".notice-item").length>=1){
		let items =  $(".notice-item");
		console.log($(".notice-item").length);
		console.log($(".news-slide").length);
		for(let i = 0;i< items.length ;i++){
			let j = Math.floor(i/4);
			console.log(j);
			$(".news-slide")[j].append(items[i]);
		}
	}
})
//基础类
//jq ajax 封装
function ajax(method, url, param){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: url,
            type: method,
            data: param || '',
            dataType: "json",
            success: function(data){
                resolve(data);
            },
            error: function(error){
                reject(error)
            }
        });
    });
};
//toast
function toast(mess){
    var str='<div class="toast"><span></span></div>';
    $("body").append(str);
    $(".toast").fadeIn().find("span").html(mess);
    setTimeout(function(){
        $(".toast").fadeOut();
    },2000)
}
//逻辑类
//登录
function login(){
	let data = {//保存到datajson
		phonenumber: $("input[name='tel']").val(),
		password: $("input[name='password']").val(),
	}
	let check = true;
	if(check){
		//输入不为空
		if(data.phonenumber =='' || data.password =='' ){
			toast("输入不为空");
			return false;
		}
		//手机验证
		let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test($("input[name='tel']").val())){ 
			toast("请输入有效的手机号码");
			return false; 
		}
	}
	ajax("GET",globalUrl+"/login/a/",{phonenumber: $("input[name='tel']").val()}).then(res=>{//先验证手机号码是老师还是学生
		let url ='';
		if(res.code == 200){
			if(res.data[0].boolteacher==0){//0是学生手机号码
				url = globalUrl+"/login/slogin/"
			}else if(res.data[0].boolteacher==1){//1是老师手机号码
				url = globalUrl+"/login/tlogin/"
			}
			if(url!=''){
				ajax("POST",url,data).then(res=>{//验证账号密码
					if(res.slogin!="null" || res.tlogin!="null"){//登录成功
						if(res.student_name){//将用户信息保存到cookie里面
							sessionStorage.setItem("user_id", res.slogin);
							sessionStorage.setItem("user_name", res.student_name);
							sessionStorage.setItem("user_cellnumber", res.student_cellnumber);
							sessionStorage.setItem("user_privilege", "student");
							sessionStorage.setItem("isLogin","true");
						}else if(res.teacher_name){
							sessionStorage.setItem('user_id', res.tlogin);
							sessionStorage.setItem('user_name', res.teacher_name);
							sessionStorage.setItem('user_cellnumber', res.teacher_cellnumber);
							sessionStorage.setItem('user_privilege', "teacher");
							sessionStorage.setItem('isLogin',"true");
						}else{
							toast("登录用户错误");
						}
						//跳转到首页面
						toast("登录成功，页面跳转中...");
						setTimeout("javascript:location.href='../index.html'", 1000);
					}else{//登录失败
						toast("账号或密码错误");
					}
				})
			}
		}
	})
}
//注销
function logOut(){
	sessionStorage.removeItem('user_id');
	sessionStorage.removeItem('user_name');
	sessionStorage.removeItem('user_cellnumber');
	sessionStorage.removeItem('user_privilege');
	sessionStorage.removeItem('isLogin');
	stateChange();
}
//注册
function register(){
	let data = {
		phonenumber: $("input[name='tel']").val(),
		password: $("input[name='password']").val(),
		passwordR: $("input[name='passwordR']").val(),
		verificationcode: $("input[name='code']").val(),
		studentname: $("input[name='name']").val(),
		agree: $("input[name='agree']").prop("checked")
	}
	let check = true;
	if(check){
		//输入不为空
		if(data.phonenumber =='' || data.password =='' || data.passwordR =='' || data.verificationcode =='' || data.studentname ==''){
			toast("输入不为空");
			return false;
		}
		//是否阅读接受
		console.log(data.agree);
		if(!data.agree){
			toast("未接受协议");
			return false;
		}
		//密码重复
		if(data.password!=data.passwordR){
			toast("重复密码不一致");
			return false;
		}
		//手机验证
		let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test($("input[name='tel']").val())){ 
			toast("请输入有效的手机号码");
			return false; 
		}
	}
	ajax("POST",globalUrl+"/login/createnews/",data).then(res=>{
		if(res.screate==0){
			toast("账号创建成功");
		}else{
			toast(res.result);
		}
	})
}
function buttonState(){//改变按钮状态
	let count = 60;
	$('.sendCode').addClass("sendCode-active");
	const countDown = setInterval(() => {
		if (count === 0) {
			$(".sendCode").text('重新发送').removeAttr('disabled');
			$(".sendCode").removeClass("sendCode-active");
		clearInterval(countDown);
		} else {
			$('.sendCode').attr('disabled', true);
			$('.sendCode').text(count + '{%trans "秒后可重新获取" %}');
		}
		count--;
	}, 1000);
}
function sendCode(type){//学生,教师发送手机验证短信
	let data = {
		cellphone: $("input[name='tel']").val(),
		phonenumber: $("input[name='tel']").val()
	};
	//检测手机号码
	let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/; 
	if(!myreg.test($("input[name='tel']").val())){ 
		toast("请输入有效的手机号码");
		return false; 
	}
	ajax("GET",globalUrl+"/login/a/",{phonenumber: $("input[name='tel']").val()}).then(res=>{
		let url ='';
		if(res.code == 200){
			if(res.data[0].boolteacher==0){//0是学生手机号码
				url = globalUrl+"/login/sregistersendsms/"
				if(type=="reset"){//找回密码
					url = globalUrl+"/login/schangepassendsms/"
				}
			}else if(res.data[0].boolteacher==1){//1是老师手机号码
				url = globalUrl+"/login/tregistersendsms/"
				if(type=="reset"){//找回密码
					url = globalUrl+"/login/tchangepassendsms/"
				}
			}
			if(url!=''){
				ajax("POST",url,data).then(res=>{
					console.log(res);
				})
			}
		}
	})
	buttonState();
}
//登录注销后页面的样式改变
function stateChange(){
	if(isLogin=="true"){
		console.log("logined")
		$(".toLogin").hide();
		$(".header-face").show();
	}else{
		console.log("noLogin");
		$(".toLogin").show();
		$(".header-face").hide();
	}
}
//处理头部导航栏登录状态和样式切换
function headerInit(){
	$(".resource-item-overview").click(function(){
		$(".allview").hide();
		$(".overview").show();
	})
	$(".resource-item-checkAll").click(function(){
		$(".allview").show();
		$(".overview").hide();
	})
	//样式切换
	$(".header-cancel").hide();
	$(".header-center").hide();
	$(".header-cancel").click(function(){
		$(".header-active").attr("class","header");
		$(".header-item").toggle();
		$(".header-cancel").toggle();
		$(".header-center").fadeOut(500);
	})
	$(".header-item").click(function(){
		$(".header").attr("class","header-active");
		$(".header-cancel").toggle();
		$(".header-item").toggle();
		$(".header-center").fadeIn(500);
	})
}
//找回密码
function resetPassword(){
	let data = {
		phonenumber: $("input[name='tel']").val(),
		newpassword: $("input[name='password']").val(),
		passwordR: $("input[name='passwordR']").val(),
		verificationcode: $("input[name='code']").val()
	}
	let check = true;
	if(check){
		//输入不为空
		if(data.phonenumber =='' || data.newpassword =='' || data.passwordR =='' || data.verificationCode =='' ){
			toast("输入不为空");
			return false;
		}
		//密码重复
		if(data.newpassword!=data.passwordR){
			toast("重复密码不一致");
			return false;
		}
		//手机验证
		let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test($("input[name='tel']").val())){ 
			toast("请输入有效的手机号码");
			return false; 
		}
	}
	data = {
		phonenumber: $("input[name='tel']").val(),
		newpassword: $("input[name='password']").val(),
		verificationcode: $("input[name='code']").val()
	}
	console.log(data);
	ajax("GET",globalUrl+"/login/a/",{phonenumber: $("input[name='tel']").val()}).then(res=>{
		let url ='';
		if(res.code == 200){
			if(res.data[0].boolteacher==0){//0是学生手机号码
				url = globalUrl+"/login/schangepas/"
			}else if(res.data[0].boolteacher==1){//1是老师手机号码
				url = globalUrl+"/login/tchangepas/"
			}
			if(url!=''){
				console.log(data);
				ajax("POST",url,data).then(res=>{
					console.log(res);
					if(res.schange==0||res.tchange==0){
						toast("修改成功,正在跳转到登录页面...");
						setTimeout("javascript:location.href='../login.html'", 1000);
					}else{
						toast(res.result)
					}
				})
			}
		}
	})
}