<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td height="30" bgcolor="#555555"><table width="960" border="0" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td>
		<!--<a href="#" class="write12">【公告】12312313123</a>-->
		</td>
        <td width="212" align="right">
	<a href="/" class="write12">首页</a>
	
{if empty($user)}
	<a href="/user" class="write12">注册</a> <a href="/user" class="write12">登录</a> <a href="#" class="write12">帮助</a>
{else}
	<!--<span class="write12">您好，欢迎{if !empty($user['UserAlias'])}{$user['UserAlias']}{else}{$user['UserSID']}{/if}</span>--><a href="/user" class="write12">个人中心</a> <a href="/user.main.logout" class="write12">退出</a> <a href="#" class="write12">帮助</a>
{/if}
	
	</td>
      </tr>
    </table></td>
  </tr>
</table>

