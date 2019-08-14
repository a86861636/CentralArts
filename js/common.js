
function sendCode(){//发送验证码
	$.ajax({
        type: "GET"/"POST",
        url: "目标文件.php",
        data: {
           所要传到后端的数据
        },
        async:true,
        dataType: "json",
        sucess:responsRes,
        error:function (err) {
            console.log(err);
        }
    });
}