<?php
/* Smarty version 3.1.29, created on 2018-01-17 02:10:24
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_plugins\ode\views\components\preview.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a5f2110ed4208_50728463',
  'file_dependency' => 
  array (
    'e86698a351c7502befe61d5e063b1dbf37e6f159' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_plugins\\ode\\views\\components\\preview.html',
      1 => 1513093767,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a5f2110ed4208_50728463 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\block.style.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


    body .floatbox_header
    {
        display: none;
    }

    body .floatbox_bottom
    {
        display: none;
    }

    body .floatbox_body
    {
        padding: 0px 0px 0px 0px;
    }

    body .floatbox_canvas .floatbox_container{ margin-top:20px; }


<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<!-- CROSS BROWSER FIX -->
<iframe id="ode_controllet_iframe_placeholder" component='<?php echo $_smarty_tpl->tpl_vars['component']->value;?>
' src="/splod/ow_static/plugins/ode/pages/sevc.html" height="100%" width="100%"/>
<?php }
}
