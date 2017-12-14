<?php
/* Smarty version 3.1.29, created on 2017-12-14 06:04:23
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_plugins\ode\views\components\help.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a3284e7708d50_03813034',
  'file_dependency' => 
  array (
    '8749bd98cd3505ab422aaefa16ed21d63d456507' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_plugins\\ode\\views\\components\\help.html',
      1 => 1512492295,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a3284e7708d50_03813034 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\block.style.php';
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
