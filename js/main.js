/* ========== 胡玉艳设计作品集 · 画廊逻辑 ========== */
(function () {
  "use strict";

  /* 章节数据：与 assets/images 下的渲染图片一一对应 */
  var SECTIONS = [
    { id: "sec-01",  index: "01", title: "封面 · 个人信息", img: "assets/images/section_01.jpg" },
    { id: "sec-02",  index: "02", title: "空间设计 · 章节页", img: "assets/images/section_02.jpg" },
    { id: "sec-03",  index: "03", title: "野绿 · 轻食商业空间设计", img: "assets/images/section_03.jpg" },
    { id: "sec-04",  index: "04", title: "轻食餐饮 · 目标用户分析", img: "assets/images/section_04.jpg" },
    { id: "sec-05",  index: "05", title: "软装搭配细节 · 材料搭配", img: "assets/images/section_05.jpg" },
    { id: "sec-06",  index: "06", title: "软装搭配", img: "assets/images/section_06.jpg" },
    { id: "sec-07",  index: "07", title: "室内材料配置", img: "assets/images/section_07.jpg" },
    { id: "sec-08",  index: "08", title: "项目效果图", img: "assets/images/section_08.jpg" },
    { id: "sec-09",  index: "09", title: "旧城印象 · 景观改造", img: "assets/images/section_09.jpg" },
    { id: "sec-10",  index: "10", title: "人性化设计", img: "assets/images/section_10.jpg" },
    { id: "sec-11",  index: "11", title: "室外材料配置", img: "assets/images/section_11.jpg" },
    { id: "sec-12",  index: "12", title: "项目效果图", img: "assets/images/section_12.jpg" },
    { id: "sec-13",  index: "13", title: "平面设计 · 章节页", img: "assets/images/section_13.jpg" },
    { id: "sec-14",  index: "14", title: "地道广德 · 品牌设计", img: "assets/images/section_14.jpg" },
    { id: "sec-15",  index: "15", title: "项目效果图 · 海报设计 & 桌面壁纸", img: "assets/images/section_15.jpg" },
    { id: "sec-16",  index: "16", title: "UI 设计 · 章节页", img: "assets/images/section_16.jpg" },
    { id: "sec-17",  index: "17", title: "车载界面设计", img: "assets/images/section_17.jpg" },
    { id: "sec-18",  index: "18", title: "APP 界面设计", img: "assets/images/section_18.jpg" },
    { id: "sec-19",  index: "19", title: "组件卡设计", img: "assets/images/section_19.jpg" },
    { id: "sec-20",  index: "20", title: "IP 设计 · 章节页", img: "assets/images/section_20.jpg" },
    { id: "sec-21",  index: "21", title: "茶小夏 · 奶茶品牌 IP 设计", img: "assets/images/section_21.jpg" },
    { id: "sec-22",  index: "22", title: "项目成果 · 色彩搭配", img: "assets/images/section_22.jpg" },
    { id: "sec-23",  index: "23", title: "咖宝 · 终端品牌 IP 设计", img: "assets/images/section_23.jpg" },
    { id: "sec-24",  index: "24", title: "新媒体运营 · 章节页", img: "assets/images/section_24.jpg" },
    { id: "sec-25",  index: "25", title: "项目数据 · 小红书运营", img: "assets/images/section_25.jpg" },
    { id: "sec-26",  index: "26", title: "项目数据 · AI 赋能内容提质", img: "assets/images/section_26.jpg" },
    { id: "sec-27",  index: "27", title: "END · 谢谢阅览", img: "assets/images/section_27.jpg" }
  ];

  var pagesEl = document.getElementById("pages");

  /* 渲染页面卡片 */
  function render() {
    var html = "";
    SECTIONS.forEach(function (s) {
      html +=
        '<article class="page-card" id="' + s.id + '">' +
          '<div class="page-label">' +
            '<span class="page-index">' + s.index + '</span>' +
            '<span class="page-title">' + s.title + '</span>' +
          '</div>' +
          '<div class="page-frame">' +
            '<img data-src="' + s.img + '" alt="' + s.title + '" loading="lazy">' +
            '<div class="ph">加载中…</div>' +
          '</div>' +
        '</article>';
    });
    pagesEl.innerHTML = html;
  }

  /* 懒加载 */
  function lazyLoad() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll(".page-frame img[data-src]"));
    if (!("IntersectionObserver" in window)) {
      imgs.forEach(function (img) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        img.classList.add("loaded");
        var ph = img.nextElementSibling;
        if (ph && ph.classList) ph.classList.add("hidden");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          var src = img.getAttribute("data-src");
          if (!src) return;
          img.src = src;
          img.removeAttribute("data-src");
          img.addEventListener("load", function () {
            img.classList.add("loaded");
            var ph = img.nextElementSibling;
            if (ph && ph.classList) ph.classList.add("hidden");
          });
          /* 兜底：缓存中直接加载完成 */
          if (img.complete) {
            img.classList.add("loaded");
            var ph2 = img.nextElementSibling;
            if (ph2 && ph2.classList) ph2.classList.add("hidden");
          }
          io.unobserve(img);
        }
      });
    }, { rootMargin: "300px 0px" });
    imgs.forEach(function (img) { io.observe(img); });
  }

  /* 导航高亮 + 返回顶部 */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var backTop = document.getElementById("backTop");
  var topbar = document.getElementById("topbar");

  function currentSectionId() {
    var pos = window.scrollY + 120;
    var current = "sec-01";
    SECTIONS.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el && el.offsetTop <= pos) current = s.id;
    });
    return current;
  }

  function highlight() {
    var id = currentSectionId();
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-target") === id);
    });
    var scrollY = window.scrollY;
    topbar.classList.toggle("scrolled", scrollY > 10);
    backTop.classList.toggle("show", scrollY > 600);
  }

  window.addEventListener("scroll", highlight, { passive: true });

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 移动端菜单 */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.classList.contains("nav-link")) {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* 初始化 */
  render();
  lazyLoad();
  highlight();
})();
