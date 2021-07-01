"use strict"
$(document).ready(function () {
  checkLogin()
  checkType()
  onclick()
  getNews()
  getCount()
  getTestPaper()
  //hover事件
  $(".labIntro").on("mouseenter mouseleave", function (event) {
    if (event.type == "mouseenter") {
      //鼠标悬浮
      $(".labIntro .icon").hide()
      $(".labIntro .tt").hide()
      $(".labIntro .content").fadeIn()
    } else if (event.type == "mouseleave") {
      //鼠标离开
      $(".labIntro .icon").fadeIn()
      $(".labIntro .tt").fadeIn()
      $(".labIntro .content").hide()
    }
  })
})
//事件绑定
function onclick() {
  $("#login-handle").click(() => {
    handleLogin()
  }) //完成登陆操作
  $("#register-to").click(() => {
    toRegister()
  }) //跳到注册界面
  $("#forget-to").click(() => {
    toForget()
  }) //跳到忘记密码界面
  $("#admin-to").click(() => {
    toAdmin()
  }) //跳到忘记密码界面
  $("#logout").click(() => {
    handleLogout()
  }) //跳到忘记密码界面
  $(".back-login").click(() => {
    toLogin()
  }) //返回登陆界面
  $(".page-control").on("click", ".item", (e) => {
    changePage(e)
  }) // 新闻页面跳转
  $(".news .list").on("click", ".item", (e) => {
    toNewsDetail(e)
  }) // 新闻页面跳转
  $(".news-detail").on("click", ".mask", (e) => {
    hideNewsDetail(e)
  }) // 隐藏新闻详情
  $(".news-detail").on("click", ".close", (e) => {
    hideNewsDetail(e)
  }) // 隐藏新闻详情
  $(".register").on("click", ".send", () => {
    handleSendCode("register")
  }) //发送验证码
  $(".validation").on("click", ".send", () => {
    handleSendCode("retrieve")
  }) //发送验证码
  $(".validation").on("click", ".sure", () => {
    checkCode()
  }) //验证码下一步
  $(".reset").on("click", ".sure", () => {
    setPassword()
  }) //修改密码
  $(".register").on("click", ".sure", () => {
    handleRegister()
  }) // 处理注册
  $(".protocol-to").on("click", ".link", () => {
    toProtocol()
  }) // 跳转到条例
  $(".protocol-box").on("click", ".cancel", () => {
    backRegister()
  }) // 跳转到注册
  $(".start.expert").click(() => {
    expertStart()
  }) // 跳转到VR页面
  $(".start.user").click(() => {
    userStart()
  }) // 跳转到VR页面
  $(".select-box").on("click", "#select-back", () => {
    window.location.href = window.location.href.split("?")[0]
    toMain()
  }) // 跳转到主要页面
  $(".select-box").on("click", ".test-btn", (e) => {
    toTestPaper(e)
  }) // 跳转到测试
  $(".select-box .option").on("click", ".item", (e) => {
    if ($.cookie("selectBtn") == "user") {
      window.location.href = e.target.href
    } else {
      window.location.href = e.target.href + "?expert=1"
    }
    return false
  }) // 跳转到测试
  $(".testPaper").on("click", ".opt", (e) => {
    selectOpt(e)
  }) //单选题
  $(".testPaper").on("click", ".back,.sureBack", (e) => {
    toSelect()
  }) //返回选择页面
  $(".testPaper").on("click", ".testPush", (e) => {
    pushTest()
  })
  $("#showScore").click(() => {
    showScore()
  }) //显示成绩
  $(".score-box").on("click", ".back", (e) => {
    hideScore()
  }) //返回选择页面
  $("#watchEditVideo").click(() => {
    watchEditVideo()
  })
  $("#watchVideo").click(() => {
    openVideoList()
  })
  $(".videoList").on("click", ".mask,.back", () => {
    hideVideoList()
  })
  $(".videoList").on("click", ".item", (e) => {
    playVideo(e)
  })
  //$('.person-box .close,.person-box .person-mask').click(()=>{hideScore()})//隐藏成绩
  //答疑显示
  $("#qa").click(() => {
    toQA()
  })
  // 隐藏
  $(".qa-detail").on("click", ".mask,.close", (e) => {
    hideQaDetail(e)
  })
  //答疑显示
  $("#material").click(() => {
    toMaterial()
  })
  $(".material-detail .nav").on("click", ".item", (e) => {
    changeMaterialType(e)
  })
  // 隐藏
  $(".material-detail").on("click", ".mask,.close", (e) => {
    hideMaterialDetail(e)
  })
}
//jq ajax 封装
function ajax(method, url, data) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/api/v1/" + url,
      // url: "http://112.125.25.154:8888/api/v1/" + url, //内网测试http://192.168.8.125:8000
      type: method,
      data: data || "",
      contentType: false,
      processData: false,
      crossDomain: true,
      headers: { "X-csrftoken": $.cookie("csrftoken") },
      success: function (data) {
        //console.log(data)
        resolve(data)
      },
      error: function (jqXHR) {
        addToast(
          jqXHR.responseJSON.meta
            ? jqXHR.responseJSON.meta.message
            : "网络错误",
          "error"
        )
      },
    })
  })
}
// 显示提醒
function addToast(text, type) {
  // error notice info success warning
  $.Toast("提示", text, type, {
    stack: true,
    has_icon: true,
    has_close_btn: true,
    fullscreen: false,
    timeout: 3000,
    sticky: false,
    has_progress: true,
    rtl: false,
  })
}
// 检查提交表单数据
function checkForm(form) {
  for (let item of Object.values(form)) {
    if (!item) {
      addToast("不能为空", "error")
      return false
    }
  }
  if (form.user) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(form.user)) {
      addToast("请输入正确的手机号", "error")
      return false
    }
  }
  if (form.password1) {
    if (form.password1 != form.password2) {
      addToast("两次密码不一致", "error")
      return false
    }
  }
  if (form.agree) {
    if (form.agree == "false") {
      addToast("没有接受用户协议", "error")
      return false
    }
  }
  return true
}
// 改密码检测验证码
function checkCode() {
  let form = {
    user: $(".validation").find('input[ name="user" ]').val(),
    code: $(".validation").find('input[ name="code" ]').val(),
  }
  if (!checkForm(form)) {
    return false
  }
  let formData = new FormData()
  formData.append("user", form.user)
  formData.append("code", form.code)
  ajax("POST", "users/user/verify/", formData).then((res) => {
    if (res.meta.code == 200) {
      addToast("验证通过", "success")
      toReset()
      $(".reset").find('input[ name="user" ]').val(form.user)
      $(".reset").find('input[ name="code" ]').val(form.code)
    } else {
      addToast(res.meta.message, "error")
    }
  })
}
function checkLogin() {
  //ilabx登录（根据服务端发送到div里的信息）
  let loginText = $("#ilabxLogin").text()
  if (loginText && loginText != "{{ data }}") {
    let str = loginText
      .replaceAll("True", "true")
      .replaceAll("False", "false")
      .replaceAll("None", "null")
      .replace(/'/g, '"')
    $.cookie("userInfo", str)
  }
  //检查cookie里面userInfo的数据判断登录状态
  if (!$.cookie("userInfo") || $.cookie("userInfo") == "null") {
    //nologin
  } else {
    //logined
    logined = true
    userInfo = JSON.parse($.cookie("userInfo"))
    $(".logined .text").text(`${userInfo.user},登陆成功`)
    toLogined()
  }
}
//检查url参数type，select显示选择界面
function checkType() {
  if (getUrlParam("type") == "select") {
    if (logined) {
      toSelect()
    } else if ($.cookie("userType") == "expert") {
      toSelect()
    }
  }
}
//设置密码
function setPassword() {
  let form = {
    user: $(".reset").find('input[ name="user" ]').val(),
    password1: $(".reset").find('input[ name="password1" ]').val(),
    password2: $(".reset").find('input[ name="password2" ]').val(),
    code: $(".reset").find('input[ name="code" ]').val(),
  }
  if (!checkForm(form)) {
    return false
  }
  let formData = new FormData()
  formData.append("user", form.user)
  formData.append("type", "back")
  formData.append("password1", form.password2)
  formData.append("password2", form.password2)
  formData.append("code", form.code)
  ajax("PATCH", `users/${form.user}/`, formData).then((res) => {
    if (res.meta.code == 201) {
      addToast("修改成功", "success")
      toLogin()
    } else {
      addToast(res.meta.message, "error")
    }
  })
}
//获取url中的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) //匹配目标参数
  if (r != null) return unescape(r[2])
  return null //返回参数值
}
// 登陆
var logined = false
var userInfo = {}
//账号密码登录
function handleLogin() {
  let form = {
    user: $(".login").find('input[ name="user" ]').val(),
    password: $(".login").find('input[ name="password" ]').val(),
  }
  if (!checkForm(form)) {
    return false
  }
  let formData = new FormData()
  formData.append("user", form.user)
  formData.append("password", form.password)
  ajax("POST", "users/user/login/", formData).then((res) => {
    if (res.meta.code == 200) {
      addToast("登陆成功", "success")
      logined = true
      userInfo = res.data
      $.cookie("userInfo", JSON.stringify(userInfo))
      $(".logined .text").text(`${userInfo.user},登陆成功`)
      toLogined()
    } else {
      addToast(res.meta.message, "error")
    }
  })
}
//退出登录
function handleLogout() {
  userInfo = {}
  logined = false
  sessionStorage.removeItem("user")
  $.cookie("userInfo", "")
  window.location.reload()
}
// 注册
function handleRegister() {
  let form = {
    user: $(".register").find('input[ name="user" ]').val(),
    password1: $(".register").find('input[ name="password1" ]').val(),
    password2: $(".register").find('input[ name="password2" ]').val(),
    //code: $('.register').find('input[ name="code" ]').val(),
    agree: $(".register")
      .find('input[ name="agree" ]')
      .is(":checked")
      .toString(),
  }
  if (!checkForm(form)) {
    return false
  }
  let formData = new FormData()
  formData.append("user", form.user)
  formData.append("password1", form.password1)
  formData.append("password2", form.password2)
  //formData.append('code',form.code)
  ajax("POST", "users/", formData).then((res) => {
    if (res.meta.code == 201) {
      addToast("注册成功", "success")
      toLogin()
    } else {
      addToast(res.meta.message, "error")
    }
  })
}
// 发送验证码
let time = 0
let timer = null
function handleSendCode(type) {
  if (time > 0) {
    return false
  }
  let form = {
    type: type,
  }
  if (type == "register") {
    form.user = $(".register").find('input[ name="user" ]').val()
  } else {
    form.user = $(".validation").find('input[ name="user" ]').val()
  }
  if (!checkForm(form)) {
    return false
  }
  function counting() {
    // 倒计时60s
    time = 60
    timer = setInterval(() => {
      time--
      if (time == 0) {
        clearInter()
      } else {
        $(".validation")
          .find(".send")
          .text(time + "S")
        $(".register")
          .find(".send")
          .text(time + "S")
      }
    }, 1000)
  }
  let formData = new FormData()
  formData.append("user", form.user)
  formData.append("type", form.type)
  ajax("POST", "users/user/send/", formData).then((res) => {
    if (res.meta.code == 200) {
      addToast("发送成功", "success")
      counting()
    } else {
      addToast(res.meta.message, "error")
    }
  })
}
// 清理计时器
function clearInter() {
  window.clearInterval(timer)
  $(".register").find(".send").text("发送验证码")
  $(".validation").find(".send").text("发送验证码")
  timer = null
  time = 0
}
// 清空输入
function clearInput() {
  $("input").val("")
}
function toLogin() {
  clearInter()
  clearInput()
  $(".reset,.validation,.register,.login,.logined").addClass("displayN")
  $(".login").removeClass("displayN")
  $(".entrance").removeClass("displayN")
}
function toReset() {
  clearInter()
  clearInput()
  $(".reset,.validation,.register,.login,logined").addClass("displayN")
  $(".reset").removeClass("displayN")
}
function toLogined() {
  clearInter()
  clearInput()
  $(".reset,.validation,.register,.login,logined").addClass("displayN")
  $(".logined").removeClass("displayN")
}
function toRegister() {
  clearInter()
  clearInput()
  $(".reset,.validation,.register,.login,logined,.entrance").addClass(
    "displayN"
  )
  $(".register").removeClass("displayN")
}
function toForget() {
  clearInter()
  clearInput()
  $(".reset,.validation,.register,.login,logined").addClass("displayN")
  $(".validation").removeClass("displayN")
}
function toSelect() {
  clearInter()
  clearInput()
  $(".main").addClass("displayN")
  $(".testPaper").addClass("displayN")
  $(".select-box").removeClass("displayN")
}
function toMain() {
  $(".select-box").addClass("displayN")
  $(".main").removeClass("displayN")
  checkLogin()
}
function toTestPaper(e) {
  let parent = $(".testPaper")
  parent.find(".sureBack").addClass("displayN")
  parent.find(".testPush").removeClass("displayN")

  let id = $(e.target).attr("testId")
  let testName = $(e.target).parent().parent().find(".tt").eq(0).text()

  if (setTestPaper(id, testName)) {
    $(".select-box").addClass("displayN")
    $(".testPaper").removeClass("displayN")
  } else {
    addToast("试题获取失败", "error")
  }
}
function toAdmin() {
  window.location.href = "/login/"
}
//显示材料
let material
function toMaterial() {
  // addToast("功能建设中", "notice")
  // return
  if (!material) {
    getMaterial()
  }
  $(".material-detail .box").animate(
    {
      scrollTop: 0,
    },
    10
  )
  $(".material-detail").show()
}
function getMaterial() {
  ajax("GET", "material/certificate-get/?page=1&page_size=100").then((res) => {
    material = res.data.results
    addMaterial(material)
    // addNews()
  })
}
function addMaterial(list) {
  //数组排序
  // function sortFileType(a, b) {
  //   return a.file_type - b.file_type //由低到高
  // }
  // list.sort(sortFileType)
  let parent = $(".material-detail").find(".list").eq(0)
  let obj = ""
  for (let item of list) {
    obj =
      obj +
      `<div class="item" type="${item.file_type}">
      <div class="title">${item.certificate_name}</div>
      <img class="image" src="media/${item.image}" />
      <a class="link" href="media/${item.file}" download="${item.file}">文件下载</a>
    </div>`
  }
  parent.append(obj)
  showDefaultMaterial()
}
function showDefaultMaterial() {
  let type = $(".material-detail .nav .active").attr("type")
  $(`.material-detail .list .item`).hide()
  $(`.material-detail .list .item[type='${type}']`).show()
}
function changeMaterialType(e) {
  let type = $(e.target).attr("type")
  $(".material-detail .nav .item").removeClass("active")
  $(e.target).addClass("active")
  $(`.material-detail .list .item`).hide()
  $(`.material-detail .list .item[type='${type}']`).show()
}
function hideMaterialDetail() {
  $(".material-detail").hide()
}
//显示答疑
let qaList
function toQA() {
  if (!qaList) {
    getQa()
  }
  $(".qa-detail").show()
}
function getQa() {
  ajax("GET", "material/coach/?page=1&page_size=100").then((res) => {
    qaList = res.data.results
    addQa(qaList)
    // addNews()
  })
}
function addQa(list) {
  let parent = $(".qa-detail").find(".list").eq(0)
  let obj = ""
  let i = 1
  for (let item of list) {
    obj =
      obj +
      `<div class="item">
      <div class="title">${i}. ${item.question}</div>
      <div class="content">答：${item.answer}</div>
    </div>`
    i++
  }
  parent.append(obj)
}
function hideQaDetail() {
  $(".qa-detail").hide()
}

function toNewsDetail(e) {
  let id = $(e.target).attr("newsId")
  if (!id) {
    id = $(e.target).parent().attr("newsId")
  }
  $(".news-detail").show()
  for (let item of newList) {
    if (item.id == id) {
      $(".news-detail").find(".tt").text(item.title)
      $(".news-detail").find(".content").text(item.content)
      $(".news-detail").find(".time").text(item.date)
    }
  }
}
function toProtocol() {
  $("main").addClass("displayN")
  $(".protocol-box").removeClass("displayN")
}
function backRegister() {
  $(".protocol-box").addClass("displayN")
  $("main").removeClass("displayN")
}
function userStart() {
  if (logined) {
    $.cookie("userType", "student")
    $.cookie("selectBtn", "user")
    window.history.pushState(
      null,
      null,
      window.location.href.split("?")[0] + "?type=select&export=0"
    )
    toSelect()
  } else {
    addToast("请先登陆", "error")
  }
}
function expertStart() {
  if (!logined || userInfo.identity == "专家") {
    $.cookie("userType", "expert")
    toSelect()
  } else {
    toSelect()
    // addToast("学生禁止使用", "error")
  }
  window.history.pushState(
    null,
    null,
    window.location.href.split("?")[0] + "?type=select&export=1"
  )
  $.cookie("selectBtn", "expert")
}
// 获取新闻列表
let newList = []
function getNews() {
  ajax("GET", "news/").then((res) => {
    newList = res.data
    addNews()
  })
}

function getScoreInfo() {
  // ajax('GET','vr/theory/'+userInfo.user+'/').then(res=>{
  // 	if(res.meta.code==200){
  // 		//setVrTable('theory',res.data.situation)
  // 	}
  // })
  ajax("GET", "vr/result/" + userInfo.user + "/").then((res) => {
    if (res.meta.code == 200) {
      setDetailTable("practice", res.data.status || "0b0000000000")
    }
  })
  ajax("GET", "StuTestSubject/?page=1&page_size=100&stu=" + userInfo.id).then(
    (res) => {
      if (res.code == 200) {
        setDetailTable("theory", handleTestScoreData(res.data.results))
        //setScoreTable(res.data.results)
      }
    }
  )
  ajax("GET", "users/" + userInfo.user + "/?user=" + userInfo.user).then(
    (res) => {
      if (res.meta.code == 200) {
        let comment = res.data.evaluate_info[0]
        let score = res.data.score_info
        setScoreTable("teacher", score.tec_point, comment.whole)
      } else {
        addToast("获取数据失败", "error")
      }
    }
  )
}
function handleTestScoreData(data) {
  //测试成绩
  let testScore = [
    {
      id: 0,
      name: "叙事空间分布",
      status: "",
      score: 0,
      totalScore: 6,
      finish: false,
    },
    {
      id: 0,
      name: "全景视觉引导原则",
      status: "",
      score: 0,
      totalScore: 10,
      finish: false,
    },
    {
      id: 2,
      name: "全景声音",
      status: "",
      score: 0,
      totalScore: 8,
      finish: false,
    },
    {
      id: 3,
      name: "摄像机与机位",
      status: "",
      score: 0,
      totalScore: 6,
      finish: false,
    },
  ]
  for (let item of data) {
    let curCategory = testScore[item.category]
    curCategory.score = 0
    curCategory.status = ""
    let length = item.result.length || 1
    curCategory.totalScore = length * 2
    item.status = item.status.toString(2)

    while (item.status.length < length) {
      if (item.status.length != length) {
        item.status = "0" + item.status
      }
    }
    for (let i of item.status) {
      if (i == 1) {
        curCategory.score = curCategory.score + 2
      }
    }
    curCategory.status = item.status
    curCategory.finish = true
  }
  return testScore
}
function setDetailTable(type, data) {
  let table = $(".detailTable")
  if (type == "theory") {
    let i = 0
    let allScore = 0
    for (let item of data) {
      let categoryDom = table.find(`tr[category="${i}"]`)
      let scoreDom = categoryDom.find('td[type="theory-score"]')
      let finishDom = categoryDom.find('td[type="theory"]')
      let scoreText = ""
      if (item.finish) {
        scoreDom.text(item.score + "/" + item.totalScore)
        finishDom.html('<span class="colorG">已提交</span>')
        allScore = allScore + item.score
      } else {
        scoreDom.text("-/" + item.totalScore)
        finishDom.html('<span class="colorR">未提交</span>')
      }
      i++
    }
    let comment = ""
    switch (true) {
      case allScore >= 20 && allScore <= 30:
        comment = "对全景叙事的理论知识和基本原理进行了认真学习。"
        break

      case allScore >= 10 && allScore <= 19:
        comment =
          "对全景叙事的部分理论知识和基本原理进行了学习，理解和记忆水平还有欠缺，需加强理论知识学习。"
        break

      case allScore <= 9:
        comment = "对全景叙事理论知识的理解和记忆不够，需补充理论知识学习。"
        break
    }
    setScoreTable("theory", allScore, comment)
    table.find("#theory-allScore").text(allScore)
  } else if (type == "practice") {
    let allScore = 0
    let practiceList = [
      {
        index: 8,
        score: 3,
        name: "单视点分布",
      },
      {
        index: 1,
        score: 3,
        name: "对立视点分布",
      },
      {
        index: 2,
        score: 3,
        name: "多视点分布",
      },
      {
        index: 4,
        score: 6,
        name: "光线引导",
      },
      {
        index: 9,
        score: 6,
        name: "运动引导",
      },
      {
        index: 3,
        score: 3,
        name: "角色视线引导",
      },
      {
        index: 5,
        score: 12,
        name: "色彩对比引导",
      },
      {
        index: 7,
        score: 3,
        name: "视野限制引导",
      },
      {
        index: 6,
        score: 6,
        name: "声音引导",
      },
    ]
    for (let item of practiceList) {
      console.log(item)
      console.log(data[item.index])
      let categoryDom = table.find(`tr[practice-index="${item.index}"]`)
      let scoreDom = categoryDom.find('td[type="practice-score"]')
      let finishDom = categoryDom.find('td[type="practice"]')
      let status = data.split("").reverse()[item.index]
      if (status == 1) {
        scoreDom.text(item.score + "/" + item.score)
        finishDom.html('<span class="colorG">已提交</span>')
        allScore = allScore + item.score
      } else if (status == 0) {
        scoreDom.text("-/" + item.score)
        finishDom.html('<span class="colorR">未提交</span>')
      }
    }
    let comment = ""
    switch (true) {
      case allScore >= 30 && allScore <= 45:
        comment =
          "在三维场景的模拟练习中，能够很好理解并有效运用全景叙事引导手段，能够认真完成所有模拟练习。"
        break

      case allScore >= 15 && allScore <= 29:
        comment =
          "在三维场景的模拟练习中，对全景叙事引导手段的理解还有待加强，有个别模拟练习未完成。"
        break

      case allScore <= 14:
        comment =
          "在三维场景的模拟练习中，对全景叙事引导手段的理解水平不足，有较多模拟练习未完成。"
        break
    }
    setScoreTable("practice", allScore, comment)
    table.find("#practice-allScore").text(allScore)
  }
  countEyesScore()
}
function setScoreTable(type, score, comment) {
  //type: teacher/parctice/eyes/theory
  let noComment = "还未进行评价"
  $(`#${type}-score span`).text(score || 0)
  $(`#${type}-comment`).text(comment || noComment)
  //$('#eyes-score span').text()
  countTotalScore()
}
//设置分数和评价
function setComment(type, score, comment) {
  $(`.${type}-score`)
    .find("span")
    .text(score || score == 0 ? score + "分" : "")
  $(`.${type}-comment`).text(comment || "还未进行评价")
}
//计算学习总分数
function countEyesScore() {
  let allScore = Math.ceil(
    (Number($(`#theory-score span`).text()) +
      Number($(`#practice-score span`).text())) *
      0.13
  )
  let comment = ""
  switch (true) {
    case allScore >= 8 && allScore <= 10:
      comment = "在大部分实践作品中，重要叙事要素能够有效引导观众视线。"
      break

    case allScore >= 4 && allScore <= 7:
      comment =
        "在你提交的部分实践作品中，重要叙事要素能起到引导观众视线的作用，应加强部分知识点的理论学习和实践练习。"
      break

    case allScore <= 3:
      comment =
        "在你提交大部分实践作品中，重要叙事要素无法有效引导观众视线，请对全景叙事四个模块知识点的理论学习和实践练习。"
      break
  }
  setScoreTable("eyes", allScore, comment)
}
function countTotalScore() {
  let allScore =
    Number($(`#theory-score span`).text()) +
    Number($(`#practice-score span`).text()) +
    Number($(`#eyes-score span`).text()) +
    Number($(`#teacher-score span`).text())
  $(`#total-score span`).text(allScore || 0)
}
function getCount() {
  //浏览人数
  ajax("GET", "index/count/").then((res) => {
    let obj = `
		<div class="tt">
			访问记录
		</div>
		<div class="item">
			<img class="icon" src="/static/index/img/eye.png">
			<div class="text">浏览人数：${res.data.count}</div>
		</div>
		<div class="item">
			<img class="icon" src="/static/index/img/click.png">
			<div class="text">实验人数：${res.data.sum}</div>
		</div>
		<div class="item">
		</div>
		`
    // <img class="icon" src="/static/index/img/finish.png">
    // <div class="text">通过率：${res.data.pass_rate}</div>
    $(".count").append(obj)
  })
}
let allPaperData = [] //叙事空间分布 0；全景视觉引导原则 1；全景声音 2；摄像机与机位 3
let currentPaper = []
function getTestPaper() {
  ajax("GET", "TestSubject/?page=1&page_size=100").then((res) => {
    let data = res.data.results
    let arr = []
    for (let item of data) {
      item.options = item.options.split("\\n")
      if (!arr[item.category]) {
        arr[item.category] = []
      }
      arr[item.category].push(item)
    }
    allPaperData = arr
  })
}
function setTestPaper(id, testName) {
  if (allPaperData[id]) {
    currentPaper = allPaperData[id]
    let questionIndex = 0
    let parentDom = $(".testPaper").find(".list")
    parentDom.html("")
    $(".testName").html(testName + "测试")
    for (let item of currentPaper) {
      item.finish = false
      item.stuAnswer = ""
      item.right = false

      let optIndex = 0
      let optionDom = ""
      for (let item1 of item.options) {
        optionDom =
          optionDom +
          `
				<div class="opt" oIndex="${optIndex}">
					<img src="/static/index/img/option.png" class="opt-icon default">
					<img src="/static/index/img/option-a.png" class="opt-icon active displayN">
					${item1}
				</div>`
        optIndex++
      }
      let dom = `
				<div class="item">
					<div class="question">${questionIndex + 1}、${item.title}</div>
					<div class="options" qIndex="${questionIndex}">
						${optionDom}
					</div>
				</div>
				`
      parentDom.append(dom)
      questionIndex++
    }
    return true
  } else {
    return false
  }
}
function selectOpt(e) {
  let target = $(e.target)
  if (target.hasClass("opt-icon")) {
    target = $(e.target).parent()
  }
  let curOpt = target
  let allOpt = target.parent().find("opt")
  let parent = target.parent()
  let qIndex = parent.attr("qIndex")
  let oIndex = curOpt.attr("oIndex")
  let abc = ["A", "B", "C", "D", "E", "F", "G"]
  let qData = currentPaper[qIndex]
  parent.find(".active").addClass("displayN")
  parent.find(".default").removeClass("displayN")
  curOpt.find(".default").addClass("displayN")
  curOpt.find(".active").removeClass("displayN")
  qData.finish = true
  qData.stuAnswer = abc[oIndex]
  qData.right = qData.result == abc[oIndex]
}
function pushTest() {
  if (!userInfo.user) {
    addToast("请登录", "error")
    return false
  }
  let status = ""
  let stuAnswer = ""
  for (let item of currentPaper) {
    if (!item.finish) {
      addToast("题目没完成", "error")
      return false
    } else {
      status = status + (item.right ? "1" : "0")
      stuAnswer = stuAnswer + item.stuAnswer
    }
  }
  let formData = new FormData()
  formData.append("category", currentPaper[0].category)
  formData.append("result", stuAnswer)
  formData.append("status", parseInt(status, 2))
  formData.append("stu", userInfo.id)
  // formData.append("expert", $.cookie("selectBtn") == "user" ? 0 : 1)
  ajax(
    "POST",
    "StuTestSubject/" + ($.cookie("selectBtn") == "user" ? "" : "?expert=1"),
    formData
  ).then((res) => {
    addToast("提交成功", "success")
    showAnswer()
    //toSelect()
  })
}
// 添加新闻列表和页数按钮
let totalPage = 0
function addNews() {
  let length = newList.length
  if (length > 4) {
    length = 4
  }
  totalPage = length
  for (let i = 0; i < totalPage; i++) {
    let obj = `<div index="${i}" newsId="${
      newList[i].id
    }" class="item displayN">
								<div class="title">${newList[i].title}</div>
								<div class="content">${newList[i].content}</div>
								<div class="time">${newList[i].date_update.substring(0, 10)}</div>
							</div>`
    $(".news").find(".list").append(obj)
    if (i === 0) {
      $(".news").find(".item").removeClass("displayN")
    }
    let obj1 = `<div index="${i}" newsId="${newList[i].id}" class="item"></div>`
    $(".page-control").find(".buttons").append(obj1)
  }
  $(".page-control")
    .find(".page")
    .text(1 + "/" + totalPage)
  $(".page-control").find(".item").eq(0).addClass("active")
}
function changePage(e) {
  let index = $(e.target).attr("index")
  let id = $(e.target).attr("newsId")
  let page = Number(index) + 1
  $(".page-control")
    .find(".page")
    .text(page + "/" + totalPage)
  $(".page-control").find(".item").removeClass("active")
  $(e.target).addClass("active")
  $(".news .list").find(`.item`).addClass("displayN")
  $(".news").find(`.item[newsId="${id}"]`).removeClass("displayN")
}
function showAnswer() {
  let parent = $(".testPaper")
  parent.find(".sureBack").removeClass("displayN")
  parent.find(".testPush").addClass("displayN")
  let i = 0
  for (let item of currentPaper) {
    console.log(item)
    if (!item.right) {
      parent
        .find(".list")
        .find(".question")
        .eq(i)
        .append(`<span class="colorR">正确答案：${item.result}</span>`)
    }
    i++
  }
}
function showScore() {
  if (!userInfo.user) {
    addToast("请登录", "error")
    return false
  }
  $(".select-box").addClass("displayN")
  $(".score-box").removeClass("displayN")
  //$('.person-box').show()
  getScoreInfo()
}
function hideScore() {
  $(".score-box").addClass("displayN")
  $(".select-box").removeClass("displayN")
}
function hideNewsDetail() {
  $(".news-detail").hide()
}
//观看影片
function watchEditVideo() {
  addToast("功能建设中", "notice")
}
function openVideoList() {
  $(".videoList").removeClass("displayN")
}
function hideVideoList() {
  let player = $("#videoPlayer")
  player.trigger("pause")
  if (player.parent().hasClass("displayN")) {
    $(".videoList").addClass("displayN")
  } else {
    player.trigger("pause")
    player.parent().addClass("displayN")
  }
}
function playVideo(e) {
  let videoName = $(e.target).attr("video")
  let player = $("#videoPlayer")
  player.attr(
    "src",
    "https://bsf.oss-cn-beijing.aliyuncs.com/refer/" + videoName + ".mp4"
  )
  player.parent().removeClass("displayN")
}
