// 本地存储的键名
var AVATAR_KEY = "kkb_avatar";
var NICKNAME_KEY = "kkb_nickname";

// 默认头像（1x1 白色图片，显示为白色圆形）
var DEFAULT_AVATAR = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

// 读取昵称，没有存过则默认"李雷"
function getNickname() {
    return localStorage.getItem(NICKNAME_KEY) || "李雷";
}

// ========== 主页逻辑：显示头像昵称 + 跳转编辑页 ==========
function initHomePage() {
    var avatar = document.getElementById("avatar");
    var nickname = document.getElementById("nickname");

    avatar.src = localStorage.getItem(AVATAR_KEY) || DEFAULT_AVATAR;
    nickname.textContent = getNickname();

    // 点击"更换头像"跳转到编辑页
    document.getElementById("change-avatar").addEventListener("click", function () {
        location.href = "edit.html";
    });
}

// ========== 编辑页逻辑：本地上传头像 + 修改昵称 ==========
function initEditPage() {
    var input = document.getElementById("avatar-input");
    var preview = document.getElementById("avatar-preview");
    var nicknameInput = document.getElementById("nickname-input");
    var saveBtn = document.getElementById("save-btn");
    var newAvatar = null; // 暂存新选择的头像

    // 进入页面时显示当前头像和昵称
    preview.src = localStorage.getItem(AVATAR_KEY) || "img/kwx942.png";
    nicknameInput.value = getNickname();

    // 点击头像触发文件选择
    preview.addEventListener("click", function () {
        input.click();
    });

    // 选择图片后：压缩到 300x300 以内，转成 base64 预览（避免超出本地存储容量）
    input.addEventListener("change", function () {
        var file = input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var maxSize = 300;
                var scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                var canvas = document.createElement("canvas");
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                newAvatar = canvas.toDataURL("image/png");
                preview.src = newAvatar;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 保存到本地并返回主页
    saveBtn.addEventListener("click", function () {
        if (newAvatar) localStorage.setItem(AVATAR_KEY, newAvatar);
        var name = nicknameInput.value.trim();
        if (name) localStorage.setItem(NICKNAME_KEY, name);
        location.href = "index.html";
    });
}

// 根据页面元素判断当前是哪个页面
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("change-avatar")) initHomePage();
    if (document.getElementById("avatar-input")) initEditPage();
});
