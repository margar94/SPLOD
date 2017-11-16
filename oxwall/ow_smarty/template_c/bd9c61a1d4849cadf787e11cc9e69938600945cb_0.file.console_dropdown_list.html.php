<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:45
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\console_dropdown_list.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b1085859_95973345',
  'file_dependency' => 
  array (
    'bd9c61a1d4849cadf787e11cc9e69938600945cb' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\console_dropdown_list.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b1085859_95973345 ($_smarty_tpl) {
?>
<a href="javascript://" class="ow_console_item_link"><?php echo $_smarty_tpl->tpl_vars['label']->value;?>
</a>

<span <?php if (empty($_smarty_tpl->tpl_vars['counter']->value['number'])) {?>style="display: none;"<?php }?> class="ow_count_wrap OW_ConsoleItemCounter" >
    <span class="<?php if ($_smarty_tpl->tpl_vars['counter']->value['active']) {?>ow_count_active<?php }?> ow_count_bg OW_ConsoleItemCounterPlace">
        <span class="ow_count OW_ConsoleItemCounterNumber" <?php if (empty($_smarty_tpl->tpl_vars['counter']->value['number'])) {?>style="visibility: hidden;"<?php }?>><?php echo $_smarty_tpl->tpl_vars['counter']->value['number'];?>
</span>
    </span>
</span>
<?php }
}
