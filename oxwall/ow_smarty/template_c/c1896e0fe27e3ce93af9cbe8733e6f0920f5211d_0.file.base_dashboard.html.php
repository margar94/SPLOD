<?php
/* Smarty version 3.1.29, created on 2017-11-17 01:23:09
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\admin\views\controllers\base_dashboard.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0eaa7d8ba7a8_25604140',
  'file_dependency' => 
  array (
    'c1896e0fe27e3ce93af9cbe8733e6f0920f5211d' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\admin\\views\\controllers\\base_dashboard.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0eaa7d8ba7a8_25604140 ($_smarty_tpl) {
?>
<div class="ow_stdmargin">
    <iframe class="ow_full" src="<?php echo $_smarty_tpl->tpl_vars['adminDashboardIframeUrl']->value;?>
" style="border: 0pt none ; width: 100%; height: 250px;" frameborder="0"></iframe>
</div>
<?php echo $_smarty_tpl->tpl_vars['componentPanel']->value;
}
}
