<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:51
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\drag_and_drop_item.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b7175283_53416998',
  'file_dependency' => 
  array (
    '84bbe4546b3a45d6e75c158c63b5fe36c4faba26' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\drag_and_drop_item.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b7175283_53416998 ($_smarty_tpl) {
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
?>
<div class="ow_dnd_widget <?php echo $_smarty_tpl->tpl_vars['box']->value['uniqName'];?>
">

    <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>'box','capEnabled'=>$_smarty_tpl->tpl_vars['box']->value['show_title'],'capContent'=>$_smarty_tpl->tpl_vars['box']->value['capContent'],'capAddClass'=>"ow_dnd_configurable_component clearfix",'label'=>$_smarty_tpl->tpl_vars['box']->value['title'],'iconClass'=>$_smarty_tpl->tpl_vars['box']->value['icon'],'type'=>$_smarty_tpl->tpl_vars['box']->value['type'],'addClass'=>"ow_stdmargin clearfix ".((string)$_smarty_tpl->tpl_vars['box']->value['uniqName']),'toolbar'=>$_smarty_tpl->tpl_vars['box']->value['toolbar'])); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>'box','capEnabled'=>$_smarty_tpl->tpl_vars['box']->value['show_title'],'capContent'=>$_smarty_tpl->tpl_vars['box']->value['capContent'],'capAddClass'=>"ow_dnd_configurable_component clearfix",'label'=>$_smarty_tpl->tpl_vars['box']->value['title'],'iconClass'=>$_smarty_tpl->tpl_vars['box']->value['icon'],'type'=>$_smarty_tpl->tpl_vars['box']->value['type'],'addClass'=>"ow_stdmargin clearfix ".((string)$_smarty_tpl->tpl_vars['box']->value['uniqName']),'toolbar'=>$_smarty_tpl->tpl_vars['box']->value['toolbar']), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


        <?php echo $_smarty_tpl->tpl_vars['content']->value;?>

    <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>'box','capEnabled'=>$_smarty_tpl->tpl_vars['box']->value['show_title'],'capContent'=>$_smarty_tpl->tpl_vars['box']->value['capContent'],'capAddClass'=>"ow_dnd_configurable_component clearfix",'label'=>$_smarty_tpl->tpl_vars['box']->value['title'],'iconClass'=>$_smarty_tpl->tpl_vars['box']->value['icon'],'type'=>$_smarty_tpl->tpl_vars['box']->value['type'],'addClass'=>"ow_stdmargin clearfix ".((string)$_smarty_tpl->tpl_vars['box']->value['uniqName']),'toolbar'=>$_smarty_tpl->tpl_vars['box']->value['toolbar']), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

    
</div><?php }
}
