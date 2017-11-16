<?php
/* Smarty version 3.1.29, created on 2017-11-16 01:48:56
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\controllers\user_standard_sign_in.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0d5f08419f79_74266652',
  'file_dependency' => 
  array (
    '19b1489a42c19b097aa00361ebc1a133293bba1d' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\controllers\\user_standard_sign_in.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0d5f08419f79_74266652 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


.ow_sign_in_wrap {
	position:absolute;
	top:200px;
	left:50%;
	margin:0 0 0 -351px;
}

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<div class="ow_sign_in_cont">
    <?php echo $_smarty_tpl->tpl_vars['sign_in_form']->value;?>

</div>
<?php }
}
