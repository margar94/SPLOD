<?php
/* Smarty version 3.1.29, created on 2017-12-14 06:04:23
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_plugins\cacheextreme\views\controllers\admin_index.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a3284e72d68d7_30739199',
  'file_dependency' => 
  array (
    'fb756dacdd949a885612b826d0ae70d053b10478' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_plugins\\cacheextreme\\views\\controllers\\admin_index.html',
      1 => 1366331574,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a3284e72d68d7_30739199 ($_smarty_tpl) {
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.text.php';
if (!is_callable('smarty_function_label')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.label.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.input.php';
if (!is_callable('smarty_function_error')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.error.php';
if (!is_callable('smarty_function_submit')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.submit.php';
echo $_smarty_tpl->tpl_vars['menu']->value;?>


<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>'cacheControlForm')); $_block_repeat=true; echo smarty_block_form(array('name'=>'cacheControlForm'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


<table class="ow_table_1 ow_form ow_stdmargin">
    <tr class="ow_tr_first">
        <th class="ow_name ow_txtleft" colspan="3">
            <span class="ow_section_icon ow_ic_gear_wheel"><?php echo smarty_function_text(array('key'=>'cacheextreme+cache_settings'),$_smarty_tpl);?>
</span>
        </th>
    </tr>
    <tr class="ow_alt1">
        <td class="ow_label"><?php echo smarty_function_label(array('name'=>'templateCache'),$_smarty_tpl);?>
</td>
        <td class="ow_value">
            <?php echo smarty_function_input(array('name'=>'templateCache','class'=>'ow_settings_input'),$_smarty_tpl);?>
 <?php echo smarty_function_error(array('name'=>'templateCache'),$_smarty_tpl);?>

        </td>
        <td class="ow_desc ow_small"><?php echo smarty_function_text(array('key'=>'cacheextreme+templateCache_setting_desc'),$_smarty_tpl);?>
</td>
    </tr>
    <tr class="ow_alt1">
        <td class="ow_label"><?php echo smarty_function_label(array('name'=>'backendCache'),$_smarty_tpl);?>
</td>
        <td class="ow_value">
            <?php echo smarty_function_input(array('name'=>'backendCache','class'=>'ow_settings_input'),$_smarty_tpl);?>
 <?php echo smarty_function_error(array('name'=>'backendCache'),$_smarty_tpl);?>

        </td>
        <td class="ow_desc ow_small"><?php echo smarty_function_text(array('key'=>'cacheextreme+backendCache_setting_desc'),$_smarty_tpl);?>
</td>
    </tr>
    <tr class="ow_alt1">
        <td class="ow_label"><?php echo smarty_function_label(array('name'=>'themeStatic'),$_smarty_tpl);?>
</td>
        <td class="ow_value">
            <?php echo smarty_function_input(array('name'=>'themeStatic','class'=>'ow_settings_input'),$_smarty_tpl);?>
 <?php echo smarty_function_error(array('name'=>'themeStatic'),$_smarty_tpl);?>

        </td>
        <td class="ow_desc ow_small"><?php echo smarty_function_text(array('key'=>'cacheextreme+themeStatic_setting_desc'),$_smarty_tpl);?>
</td>
    </tr>
    <tr class="ow_alt1">
        <td class="ow_label"><?php echo smarty_function_label(array('name'=>'pluginStatic'),$_smarty_tpl);?>
</td>
        <td class="ow_value">
            <?php echo smarty_function_input(array('name'=>'pluginStatic','class'=>'ow_settings_input'),$_smarty_tpl);?>
 <?php echo smarty_function_error(array('name'=>'pluginStatic'),$_smarty_tpl);?>

        </td>
        <td class="ow_desc ow_small"><?php echo smarty_function_text(array('key'=>'cacheextreme+pluginStatic_setting_desc'),$_smarty_tpl);?>
</td>
    </tr>    
</table>
<div class="clearfix ow_stdmargin"><div class="ow_center"><?php echo smarty_function_submit(array('name'=>'clean','class'=>'ow_ic_trash ow_positive'),$_smarty_tpl);?>
</div></div>



<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>'cacheControlForm'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);
}
}
