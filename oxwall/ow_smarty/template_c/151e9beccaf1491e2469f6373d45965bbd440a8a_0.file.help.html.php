<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:45
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\ode\views\components\help.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b110a576_21166313',
  'file_dependency' => 
  array (
    '151e9beccaf1491e2469f6373d45965bbd440a8a' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\ode\\views\\components\\help.html',
      1 => 1508297158,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b110a576_21166313 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

.ow_console_item a.ow_console_item_link_helper {
    font-size: 0;
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(/ow_static/themes/spod_theme_matter/images/ic_question_white.svg) 0 0 no-repeat;
}
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<div class="ow_console_item">
    <a href="javascript://" class="ow_console_item_link_helper" onClick="ODE.showHelper()">Help</a>
</div>

<?php }
}
