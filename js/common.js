var globalUrl = "http://192.168.8.204:8001";

$(document).ready(function(){
	console.log($(".sendCode"));
	//处理头部导航栏登录状态和样式切换
	let isLogin = false;
	let user_data = {
		face: "https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=2136300761,4118574064&fm=85&s=3E63EA164415B43B5093166A03005069",
		name: "user",
	}
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
	}else{
		console.log("onLogin")
		$(".header-face").hide();
	}
	//绑定发送验证码事件
	$(".sendCode").click(function(){
		sendCode();
	})
})
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
	changeState();
	let cellphone = 190130932;
	$.ajax({
        type: "GET",
		url: globalUrl + "/login/a/",
		data: {
			cellphone: cellphone
		},
		success : function(res) {
			console.log("success");
			// let url = globalUrl;
			// if(res.data.boolteacher == 0){//学生手机号注册
			// 	url = globalUrl + "/login/sregistersendsms/"
			// }else if(res.data.boolteacher == 1){//教师手机号注册
			// 	url = globalUrl + "/login/schangepassendsms/"
			// }
			// $.ajax({
			//     type: "POST",
			// 	url: url,
			// 	data: {
			// 		cellphone: 
			// 	},
			// 	success : function(res) {
			// 		
			// 　　},
			//     error:function (err) {
			//         console.log(err);
			//     }
			// });
	　　},
        error:function (err) {
            console.log(err);
        }
    });
}