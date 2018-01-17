<?php
/* Smarty version 3.1.29, created on 2018-01-17 02:10:22
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_system_plugins\base\views\sitemap_part.xml" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a5f210ea3bd43_25269282',
  'file_dependency' => 
  array (
    'cdf3cc196460c6f25dd92b54e88ffaf825263cca' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_system_plugins\\base\\views\\sitemap_part.xml',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a5f210ea3bd43_25269282 ($_smarty_tpl) {
echo '<?xml ';?>
version="1.0" encoding="UTF-8"<?php echo '?>';?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<?php
$_from = $_smarty_tpl->tpl_vars['urls']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_url_0_saved_item = isset($_smarty_tpl->tpl_vars['url']) ? $_smarty_tpl->tpl_vars['url'] : false;
$_smarty_tpl->tpl_vars['url'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['url']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['url']->value) {
$_smarty_tpl->tpl_vars['url']->_loop = true;
$__foreach_url_0_saved_local_item = $_smarty_tpl->tpl_vars['url'];
?>
    <url>
        <changefreq><?php echo $_smarty_tpl->tpl_vars['url']->value['changefreq'];?>
</changefreq>
        <priority><?php echo $_smarty_tpl->tpl_vars['url']->value['priority'];?>
</priority>
        <loc><?php echo $_smarty_tpl->tpl_vars['url']->value['url'];?>
</loc>
        <?php
$_from = $_smarty_tpl->tpl_vars['url']->value['alternateLanguages'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_langData_1_saved_item = isset($_smarty_tpl->tpl_vars['langData']) ? $_smarty_tpl->tpl_vars['langData'] : false;
$_smarty_tpl->tpl_vars['langData'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['langData']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['langData']->value) {
$_smarty_tpl->tpl_vars['langData']->_loop = true;
$__foreach_langData_1_saved_local_item = $_smarty_tpl->tpl_vars['langData'];
?>
        <xhtml:link rel="alternate" hreflang="<?php echo $_smarty_tpl->tpl_vars['langData']->value['code'];?>
" href="<?php echo $_smarty_tpl->tpl_vars['langData']->value['url'];?>
" />
        <?php
$_smarty_tpl->tpl_vars['langData'] = $__foreach_langData_1_saved_local_item;
}
if ($__foreach_langData_1_saved_item) {
$_smarty_tpl->tpl_vars['langData'] = $__foreach_langData_1_saved_item;
}
?>
    </url>
<?php
$_smarty_tpl->tpl_vars['url'] = $__foreach_url_0_saved_local_item;
}
if ($__foreach_url_0_saved_item) {
$_smarty_tpl->tpl_vars['url'] = $__foreach_url_0_saved_item;
}
?>
</urlset>
<?php }
}
