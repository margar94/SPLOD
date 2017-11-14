<?php
/* Smarty version 3.1.29, created on 2017-11-14 02:00:07
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\admin\views\controllers\plugins_available.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abea736ee06_50015765',
  'file_dependency' => 
  array (
    'b29907e66245ba3c501a7462275b09616eaaa0e1' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\admin\\views\\controllers\\plugins_available.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abea736ee06_50015765 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


.ow_active_plugins tr, .ow_inactive_plugins tr{
    border-top:1px solid #ccc;
}
.ow_plugin_controls{
    display:none;
}

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_available_box_cap_label')); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_available_box_cap_label'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

<?php if (empty($_smarty_tpl->tpl_vars['plugins']->value)) {?>
    <?php echo smarty_function_text(array('key'=>'admin+plugins_manage_no_available_items'),$_smarty_tpl);?>

<?php } else { ?>
   <table class="ow_superwide ow_inactive_plugins" style="margin:0 auto;">
      <?php
$_from = $_smarty_tpl->tpl_vars['plugins']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_plugin_0_saved_item = isset($_smarty_tpl->tpl_vars['plugin']) ? $_smarty_tpl->tpl_vars['plugin'] : false;
$_smarty_tpl->tpl_vars['plugin'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['plugin']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['plugin']->value) {
$_smarty_tpl->tpl_vars['plugin']->_loop = true;
$__foreach_plugin_0_saved_local_item = $_smarty_tpl->tpl_vars['plugin'];
?>
      <tr class="ow_high2" onmouseover="$('span.ow_plugin_controls', $(this)).css({display:'block'});" onmouseout="$('span.ow_plugin_controls', $(this)).css({display:'none'});">
         <td style="padding: 10px 15px;">
            <b><?php echo $_smarty_tpl->tpl_vars['plugin']->value['title'];?>
</b>
            <div class="ow_small"><?php echo $_smarty_tpl->tpl_vars['plugin']->value['description'];?>
</div>
         </td>
         <td class="ow_small" style="text-align:right;width:180px;vertical-align:middle;">
             <span class="ow_plugin_controls">
                <?php if ($_smarty_tpl->tpl_vars['plugin']->value['inst_url']) {?><a class="ow_lbutton ow_green" href="<?php echo $_smarty_tpl->tpl_vars['plugin']->value['inst_url'];?>
"><?php echo smarty_function_text(array('key'=>'admin+manage_plugins_install_button_label'),$_smarty_tpl);?>
</a><?php }?>
                <?php if ($_smarty_tpl->tpl_vars['plugin']->value['del_url']) {?><a class="ow_lbutton ow_red" href="<?php echo $_smarty_tpl->tpl_vars['plugin']->value['del_url'];?>
" onclick="return confirm('<?php echo smarty_function_text(array('key'=>'admin+manage_plugins_delete_confirm_message','pluginName'=>$_smarty_tpl->tpl_vars['plugin']->value['title']),$_smarty_tpl);?>
');"><?php echo smarty_function_text(array('key'=>'admin+manage_plugins_delete_button_label'),$_smarty_tpl);?>
</a><?php }?>
             </span>
         </td>
      </tr>
      <?php
$_smarty_tpl->tpl_vars['plugin'] = $__foreach_plugin_0_saved_local_item;
}
if ($__foreach_plugin_0_saved_item) {
$_smarty_tpl->tpl_vars['plugin'] = $__foreach_plugin_0_saved_item;
}
?>
   </table>
<?php }
$_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>'box','type'=>'empty','addClass'=>'ow_stdmargin','iconClass'=>'ow_ic_trash','langLabel'=>'admin+manage_plugins_available_box_cap_label'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);
}
}
