<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:59:14
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\admin\views\controllers\plugins_add.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe72927ae5_34745982',
  'file_dependency' => 
  array (
    '3449cb343493414928607e8c27137b9674156be5' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\admin\\views\\controllers\\plugins_add.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe72927ae5_34745982 ($_smarty_tpl) {
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
if (!is_callable('smarty_function_submit')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.submit.php';
?>
<div class="ow_narrow ow_automargin" >
<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_add_box_cap_label')); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_add_box_cap_label'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>'plugin-add')); $_block_repeat=true; echo smarty_block_form(array('name'=>'plugin-add'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


<div class="ow_center ow_stdmargin">
<?php echo smarty_function_input(array('name'=>'file'),$_smarty_tpl);?>

</div>
<div class="clearfix"><div class="ow_right"><?php echo smarty_function_submit(array('name'=>'submit','class'=>'ow_positive'),$_smarty_tpl);?>
</div></div>
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>'plugin-add'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_add_box_cap_label'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

</div><?php }
}
