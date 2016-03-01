


(function (globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function (count) { return (count == 1) ? 0 : 1; };
  

  
  /* gettext library */

  django.catalog = "{}";

  django.gettext = function (msgid) {
    var value = django.catalog[msgid];
    if (typeof(value) == 'undefined') {
      return msgid;
    } else {
      return (typeof(value) == 'string') ? value : value[0];
    }
  };

  django.ngettext = function (singular, plural, count) {
    var value = django.catalog[singular];
    if (typeof(value) == 'undefined') {
      return (count == 1) ? singular : plural;
    } else {
      return value[django.pluralidx(count)];
    }
  };

  django.gettext_noop = function (msgid) { return msgid; };

  django.pgettext = function (context, msgid) {
    var value = django.gettext(context + '\x04' + msgid);
    if (value.indexOf('\x04') != -1) {
      value = msgid;
    }
    return value;
  };

  django.npgettext = function (context, singular, plural, count) {
    var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
    if (value.indexOf('\x04') != -1) {
      value = django.ngettext(singular, plural, count);
    }
    return value;
  };
  

  django.interpolate = function (fmt, obj, named) {
    if (named) {
      return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
    } else {
      return fmt.replace(/%s/g, function(match){return String(obj.shift())});
    }
  };


  /* formatting library */

  django.formats = {
    "DATETIME_FORMAT": "Y\u5e74n\u6708j\u65e5 H:i", 
    "DATETIME_INPUT_FORMATS": [
      "%Y/%m/%d %H:%M", 
      "%Y-%m-%d %H:%M", 
      "%Y\u5e74%n\u6708%j\u65e5 %H:%M", 
      "%Y/%m/%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S", 
      "%Y\u5e74%n\u6708%j\u65e5 %H:%M:%S", 
      "%Y/%m/%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y\u5e74%n\u6708%j\u65e5 %H:%n:%S.%f", 
      "%Y-%m-%d"
    ], 
    "DATE_FORMAT": "Y\u5e74n\u6708j\u65e5", 
    "DATE_INPUT_FORMATS": [
      "%Y/%m/%d", 
      "%Y-%m-%d", 
      "%Y\u5e74%n\u6708%j\u65e5"
    ], 
    "DECIMAL_SEPARATOR": ".", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "m\u6708j\u65e5", 
    "NUMBER_GROUPING": "4", 
    "SHORT_DATETIME_FORMAT": "Y\u5e74n\u6708j\u65e5 H:i", 
    "SHORT_DATE_FORMAT": "Y\u5e74n\u6708j\u65e5", 
    "THOUSAND_SEPARATOR": "", 
    "TIME_FORMAT": "H:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M", 
      "%H:%M:%S", 
      "%H:%M:%S.%f"
    ], 
    "YEAR_MONTH_FORMAT": "Y\u5e74n\u6708"
  };

  django.get_format = function (format_type) {
    var value = django.formats[format_type];
    if (typeof(value) == 'undefined') {
      return format_type;
    } else {
      return value;
    }
  };

  /* add to global namespace */
  globals.pluralidx = django.pluralidx;
  globals.gettext = django.gettext;
  globals.ngettext = django.ngettext;
  globals.gettext_noop = django.gettext_noop;
  globals.pgettext = django.pgettext;
  globals.npgettext = django.npgettext;
  globals.interpolate = django.interpolate;
  globals.get_format = django.get_format;

}(this));


(function(){
var c = window.catalog;
if(typeof(c) == 'undefined') c = window.catalog = {};

c["Fancy it"] = "喜欢";
c["Fancy"] = "欢喜";
c["Fancy'd"] = "喜欢了";
c["Edit"] = "编辑";
c['Delete'] = '删除';
c["Follow"] = "关注";
c["Following"] = "关注了";
c["Unfollow"] = "取消关注";
c["Are you sure you want to unfancy this?"] = "你确定不喜欢这个？";
c["Oops! Something went wrong."] = "哎呀，出错了。";
c["Success! You should receive a new confirmation email soon."] = "大功告成！您应该很快就会收到确认邮件。";
c['Want'] = '想要';
c['Wanted'] = '已想要'
c['{{num}} new thing'] = '{{num}} 件新物品';
c['{{num}} new things'] = '{{num}} 件新物品';
c['Loading...'] = "加载中...";
c['SEND'] = "发送";
c['SENT'] = "已发送";
c['Please check your phone number.'] = "请核对您的电话号码。";
c['Choose a category'] = "选择一个分类"
c['Add to lists...'] = "添加至列表…"

c["Flag as inappropriate"] = "标示为不适当";
c["Share Comment"] = "分享评论";
c["Translating..."] = "正在翻译......";
c["Translation failed."] = "翻译失败了。";
c["Hide comments"] = "隐藏评论";
c["Save comment"] = "保存评论";
c["Press enter to save"] = "按回车保存";

c['Feature on my profile'] = "在我的主页推荐";
c['Featured on my profile'] = "已在我的主页推荐";
c['Please choose at least three categories.'] = '请选择至少 三个 分类。';
c['Select Categories'] = '选择类别';
c['Add to Cart'] = '添加至购物车';

c['Please input name of list'] = "请入列表名称";
c['You have successfully cloned this list.'] = "您已经成功的复制了此列表。";
c['Cloning...'] = "复制中...";
c['Clone List'] = "复制列表";
c['Share This List'] = "分享清单";

c["This field is required."] = "这个区域需填。";
c["Please fix this field."] = "请修复此区域。";
c["Please enter a valid email address."] = "请输入有效的email地址。";
c["Please enter a valid URL."] = "请输入一个有效网址。";
c["Please enter a valid date."] = "请输入一个有效日期。";
c["Please enter a valid date (ISO)."] = "请输入一个有效日期 （标准格式）。";
c["Please enter a valid number."] = "请填写一个有效号码。";
c["Please enter only digits."] = "请只填写数字。";
c["Please enter a valid credit card number."] = "请填写一个有效的信用卡卡号。";
c["Please enter the same value again."] = "请重新填入一样数目。";
c["Please enter a value with a valid extension."] = "请输入一个可以有效扩展的值。";
c["Please enter no more than {0} characters."] = "请输入不多于{0} 个字符。";
c["Please enter at least {0} characters."] = "请输入不少于{0} 个字符。";
c["Please enter a value between {0} and {1} characters long."] = "请输入一个值介于{0}到{1}个字符长。";
c["Please enter a value between {0} and {1}."] = "请输入一个值介于{0}到{1}之间。";
c["Please enter a value less than or equal to {0}."] = "请输入一个值小于或等于{0}。";
c["Please enter a value greater than or equal to {0}."] = "请输入一个值大于或等于{0}。";
c["Please enter username."] = "请输入用户名。";
c["A valid email address is required"] = "请使用有效的email地址";
c["username must be greater than 2 characters long."] = "用户名需大于两个字符长。";
c["Please use alphanumeric characters for your username."] = "请使用字母与数字组成您的用户名。";
c["Please enter password."] = "请输入您的密码。";
c["Please enter email."] = "请输入email。";
c["A valid email address is required."] = "请填入有效的email地址。";
c["Password should be 6 characters or more."] = "密码不应少于6个字符。";
c["Reminder sent. Check your email momentarily."] = "提醒已发送。请前往您的email查收。";
c["Are you sure you want to close your account?"] = "你确定要关闭你的账户么？";
c["Connect with Twitter"] = "与Twitter关联";
c["Post things I fancy to Twitter"] = "发布我喜欢的物品至Twitter";
c["Linked with Twitter as"] = "关联至Twitter作为";
c["our notifications settings have been saved."] = "我们的通知设置已保存。";
c["Your password has been saved."] = "你的密码已经保存。";
c["The passwords you entered must match. Please try again."] = "您输入的密码不匹配，请重新输入后再试一次。";
c["Your notifications settings have been saved."] = "您的通知设置已保存。";
c["Your settings have been saved."] = "您的设置已保存。";
c["Are you sure?"] = "你确定么？";
c['Remove your credit card information?'] = '移除您的信用卡信息么？';
c["Edit Shipping Address"] = "编辑配送地址";
c["Add Shipping Address"] = "添加收获地址";
c["New Shipping Address"] = "新的配送地址";
c["Fancy ships worldwide with global delivery services."] = "欢喜提供全球配送服务。";
c["Do you really want to remove this shipping address?"] = "您确认要移除这个配送地址么？";
c["Sorry, we couldn't sign you in. Please try again."] = "对不起，登陆出了点儿岔子。请重试一次。";
c["The passwords you entered must match. Please try again."] = "您输入的密码不匹配，请重新输入后再试一次。";
c["Password should be 6 characters or more."] = "密码不应少于6个字符。";
c["Please enter the new password."] = "请输入新密码。";
c["Success! Your password has been changed."] = "成功！您的密码已经更改。";
c["<b>Bummer!</b> server error. Try again."] = "<b>真晦气！</b> 服务器错误。请再试一次吧。";
c["Success! Your notifications settings have been saved."] = "成功！您的通知设置已保存。";
c["Please enter your name"] = "请输入您的名字";
c["A valid email address is required"] = "请使用有效的email地址";
c["Your enhanced bio has been submitted for review by our editorial team."] = "您升级后的简介已经提交，我们的编辑团队很快会进行审核的。";
c["Success! Your profile setting has now been changed."] = "成功！您的个人资料已经更改。";
c["Failed to change currency setting."] = "成功！您的偏好设置已经更改。";
c["confirmation email has been sent to {email}."] = "确认邮件已发送至 {email}。";

c['You can leave a personalized note here'] = '您可以在这里留下一条个人备注';
c['Please select a valid quantity.'] = "请输入一个有效的数量。";
c["Please add a shipping address."] = "请添加一个配送地址。";
c['Please enter the full name.'] = "请输入您的全名。";
c['Please enter the shipping nickname.'] = "请输入您的配送昵称。";
c['Please enter a valid address.'] = "请输入有效的电子邮件地址。";
c['Please enter the city.'] = "请输入城市。";
c['Please enter the zip code.'] = "请填入邮编。";
c['Please specify a valid phone number.'] = "请填写一个有效的电话号码。";
c['Please enter a valid card number.'] = "请输入有效的信用卡号。";
c['Please enter a valid security code.'] = "请输入安全码。";
c['Please enter a valid expiration date.'] = "请输入一个失效日期。";
c['Please fill out all infromation.'] = "请填写所有信息。";
c['Notify me when available'] = "有货时请通知我";
c['{{items_count}} item in cart'] = "购物车中有 {{items_count}} 件商品";
c['{{items_count}} items in cart'] = "购物车中有 {{items_count}} 件商品";
c['{{count}} item'] = "{{count}}件商品";
c['{{count}} items'] = "{{count}}件商品";
c['Please add a shipping address.'] = "请添加一个配送地址。";
c['Remove'] = "移除";
c["Subscribed"] = "已订阅";
c['Please remove {num} unavailable item to continue'] = "请移除{num}件暂时无法购买的商品并继续";
c['Please remove {num} unavailable items to continue'] = "请移除{num}件暂时无法购买的商品并继续";
c["Please choose a shipping address"] = "请选择配送地址";
c['<b>{name}</b> has been moved to <b>Shopping Cart.</b>'] = "<b>{name}</b>已经被加入到<b>购物车。</b>";

c["Listings"] = "列表";
c['Approximately'] = "大约";

c['Please enter either the username/email of the recipient.'] = "请填写收件人的用户名或邮箱地址，至少其中一个。";
c['Please enter the name of the recipient.'] = "请填写收件人姓名。";
c['Please enter address line 1.'] = "请输入到地址第一行。";

c['Timeline'] = "时间线";
c['Recommended'] = "推荐";
c['Everything'] = "全部";
c['Food'] = "食品";
c["Men"] = "男士";
c['Media'] = "媒体";
c["Women"] = "Women";
c['Architecture'] = "建筑";
c['Kids'] = "儿童";
c['Sports & Outdoors'] = "运动 & 户外";
c['Pets'] = "宠物";
c['Travel & Destinations'] = "旅行 & 目的地";
c['DIY & Crafts'] = "DIY & 手工艺";
c['Workspace'] = "工作空间";
c['Home'] = "首页";
c['Cars & Vehicles'] = "汽车 & 交通工具";
c['Gadgets'] = "小玩意";
c['Art'] = "艺术";
c['Other'] = "其他";

c["Are you sure you want to delete this brand badge?"] = "您确定要删除这个品牌徽章？";
c["Deactivate badge?"] = "停止显示徽章？";
c["Unable to upload file."] = "无法上传文件。";

c["Your request has been submitted. We will notify you when your application has been processed."] = "您的请求已经成功提交。您的应用一旦开始处理我们会通知您的。";

c["Failed to change the address, please try again"] = "修改地址出了点儿岔子，请重试一次";
c["Wallet response verification failed"] = "钱包反馈验证失败";

c["Unlink"] = "取消链接";
c["Linked to Google as"] = "与谷歌关联作为";
c["Linked with Google as"] = "与谷歌关联作为";

c["Please retry your request."] = "请重试您的请求。";

c['Stats for <b>{{date}}</b>'] = "<b>{{date}}</b>的数据";
c['Stats from <b>{{date_from}}</b> to <b>{{date_to}}</b>'] = "<b>{{date_from}}</b> 至 <b>{{date_to}}</b>的数据";

c['Overall Statistics'] = "综合统计";
c['Clicks This Week'] = "本周热榜";
c['Sales By Recommendation'] = "热销推荐";
c['Clicks Today'] = "Clicks Today";
c['Earned Today'] = "Earned Today";
c['Last Click'] = "最近一次点击";
c['Earned This Week'] = "本周获取的积分";
c['Last Signup'] = "最后一次登录";
c['Earned This Month'] = "本月积分";

})();
