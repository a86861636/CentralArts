var globalUrl = "http://192.168.8.204:8001";
//处理
$(document).ready(function(){
	console.log($(".sendCode"));
	//处理头部导航栏登录状态和样式切换
	let isLogin = false;
	let user_data = {
		face: "https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=2136300761,4118574064&fm=85&s=3E63EA164415B43B5093166A03005069",
		name: "user",
	}
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
	
	//登录样式
	if(isLogin){
		console.log("logined")
		$(".header-face").show();
	}else{
		console.log("onLogin")
		$(".header-face").hide();
	}
	//绑定登录事件
	$(".button-login").click(function(){
		login();
	})
	//绑定注册事件
	$(".register").click(function(){
		register();
	})
	//绑定发送验证码事件
	$(".sendCode").click(function(){
		sendCode();
	})
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
	let data = {
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
	ajax("GET",globalUrl+"/login/a/",data).then(res=>{
		let url ='';
		if(res.code == 200){
			if(res.data[0].boolteacher==0){//0是学生手机号码
				url = globalUrl+"/login/slogin/"
			}else if(res.data[0].boolteacher==1){//1是老师手机号码
				url = globalUrl+"/login/tlogin/"
			}
			if(url!=''){
				ajax("POST",url,data).then(res=>{
					if(res.slogin){
						
					}else{
						
					}
					console.log(res);
				})
			}
		}
	})
}
//注册接口
function register(){//注册
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
function changeState(){//改变按钮状态
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
function sendCode(){//学生,教师发送手机验证短信
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
	ajax("GET",globalUrl+"/login/a/",data).then(res=>{
		let url ='';
		if(res.code == 200){
			if(res.data[0].boolteacher==0){//0是学生手机号码
				url = globalUrl+"/login/sregistersendsms/"
			}else if(res.data[0].boolteacher==1){//1是老师手机号码
				url = globalUrl+"/login/tregistersendsms/"
			}
			if(url!=''){
				ajax("POST",url,data).then(res=>{
					console.log(res);
				})
			}
		}
	})
	changeState();
}