<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:58:38
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\decorators\box.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe4e7336c2_37882897',
  'file_dependency' => 
  array (
    '47f8d3127075d71ffa9da75703104c613c908a70' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\decorators\\box.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe4e7336c2_37882897 ($_smarty_tpl) {
if (!is_callable('smarty_function_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.decorator.php';
if ($_smarty_tpl->tpl_vars['data']->value['capEnabled']) {?>
<div class="ow_box_cap<?php echo $_smarty_tpl->tpl_vars['data']->value['capAddClass'];?>
">
	<div class="ow_box_cap_right">
		<div class="ow_box_cap_body">
			<h3 class="<?php echo $_smarty_tpl->tpl_vars['data']->value['iconClass'];?>
"><?php echo $_smarty_tpl->tpl_vars['data']->value['label'];?>
</h3><?php echo $_smarty_tpl->tpl_vars['data']->value['capContent'];?>

		</div>
	</div>
</div>
<?php }?>
<div class="ow_box<?php echo $_smarty_tpl->tpl_vars['data']->value['addClass'];?>
 ow_break_word"<?php if (!empty($_smarty_tpl->tpl_vars['data']->value['style'])) {?> style="<?php echo $_smarty_tpl->tpl_vars['data']->value['style'];?>
"<?php }?>>
<?php echo $_smarty_tpl->tpl_vars['data']->value['content'];?>

<?php if (!empty($_smarty_tpl->tpl_vars['data']->value['toolbar'])) {?>
    <div class="ow_box_toolbar_cont clearfix">
	<?php echo smarty_function_decorator(array('name'=>'box_toolbar','itemList'=>$_smarty_tpl->tpl_vars['data']->value['toolbar']),$_smarty_tpl);?>

    </div>
<?php }
if (empty($_smarty_tpl->tpl_vars['data']->value['type'])) {?>
	<div class="ow_box_bottom_left"></div>
	<div class="ow_box_bottom_right"></div>
	<div class="ow_box_bottom_body"></div>
	<div class="ow_box_bottom_shadow"></div>
<?php }?>
</div><?php }
}
