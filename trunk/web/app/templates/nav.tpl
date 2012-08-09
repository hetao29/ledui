<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td height="30" bgcolor="#555555"><table width="960" border="0" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td width="748">
		<!--<a href="#" class="write12">【公告】12312313123</a>-->
		</td>
{if empty($user)}
        <td width="212" align="right"><a href="/user" class="write12">注册</a>　　<a href="/user" class="write12">登录</a>　　<a href="#" class="write12">帮助</a></td>
{else}
        <td width="212" align="right"><span class="write12">您好，欢迎{if !empty($user['UserAlias'])}{$user['UserAlias']}{else}{$user['UserSID']}{/if}</span><a href="/user.main.logout" class="write12">退出</a>　<a href="#" class="write12">帮助</a></td>
{/if}
      </tr>
    </table></td>
  </tr>
</table>

