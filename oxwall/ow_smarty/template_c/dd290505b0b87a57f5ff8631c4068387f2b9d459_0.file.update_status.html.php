<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:51
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\ode\views\components\update_status.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b70c1755_00134689',
  'file_dependency' => 
  array (
    'dd290505b0b87a57f5ff8631c4068387f2b9d459' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\ode\\views\\components\\update_status.html',
      1 => 1508297158,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b70c1755_00134689 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
if (!is_callable('smarty_function_submit')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.submit.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


textarea.ow_newsfeed_status_input {
height: 50px;
}

textarea.ow_newsfeed_status_input.invitation {
height: 20px;
}

.newsfeed-attachment-preview {
width: 95%;
}
.ow_side_preloader {
float: right;
padding: 0px 4px 0px 0px;
margin-top: 6px;
}
.ow_side_preloader {
display: inline-block;
width: 16px;
height: 16px;
background-repeat: no-repeat;
}

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<?php echo $_smarty_tpl->tpl_vars['datalet_definition_import']->value;?>


<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>"newsfeed_update_status")); $_block_repeat=true; echo smarty_block_form(array('name'=>"newsfeed_update_status"), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

<div class="form_auto_click">

    <div class="clearfix">
        <div class="newsfeed_update_status_picture">
        </div>
        <div class="newsfeed_update_status_info">
            <div class="ow_smallmargin"><?php echo smarty_function_input(array('name'=>"status",'class'=>"ow_newsfeed_status_input"),$_smarty_tpl);?>
</div>
        </div>
    </div>

    <div id="attachment_preview_<?php echo $_smarty_tpl->tpl_vars['uniqId']->value;?>
-oembed" class="newsfeed-attachment-preview ow_smallmargin" style="display: none;"></div>
    
    <?php echo $_smarty_tpl->tpl_vars['attachment']->value;?>

    

    <div class="ow_submit_auto_click" style="text-align: left;">
        <div class="clearfix ow_status_update_btn_block">
            <span class="ow_attachment_btn"><?php echo smarty_function_submit(array('name'=>"save"),$_smarty_tpl);?>
</span>
            <span class="ow_attachment_icons" title="<?php echo smarty_function_text(array('key'=>"ode+add_attachment"),$_smarty_tpl);?>
" style="margin-left: 6px;" >
                <span class="ow_attachments" id="<?php echo $_smarty_tpl->tpl_vars['uniqId']->value;?>
-btn-cont" >
                    <span class="clearfix">
                        <a class="image attachment_intro_placeholder" id="<?php echo $_smarty_tpl->tpl_vars['uniqId']->value;?>
-btn" href="javascript://"></a>
                    </span>
                </span>
            </span>
            <!-- ODE -->
            <span class="ow_attachment_btn rounded_attachment_btn" title="<?php echo smarty_function_text(array('key'=>"ode+add_datalet"),$_smarty_tpl);?>
" ><?php echo smarty_function_submit(array('name'=>"ode_open_dialog"),$_smarty_tpl);?>
</span>
            <span class="ow_attachment_btn rounded_attachment_btn" title="<?php echo smarty_function_text(array('key'=>"ode+add_maplet"),$_smarty_tpl);?>
" ><?php echo smarty_function_submit(array('name'=>"map_open_dialog"),$_smarty_tpl);?>
</span>
            <span class="ow_attachment_btn rounded_attachment_btn" title="<?php echo smarty_function_text(array('key'=>"ode+my_space"),$_smarty_tpl);?>
" ><?php echo smarty_function_submit(array('name'=>"my_space"),$_smarty_tpl);?>
</span>
            <!-- ODE -->
            <span class="ow_side_preloader_wrap"><span class="ow_side_preloader ow_inprogress newsfeed-status-preloader" style="display: none;"></span></span>
        </div>
    </div>

    <div style="display: none" id="ode_controllet_placeholder" class="ow_box ow_no_cap">
    </div>


</div>
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>"newsfeed_update_status"), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);
}
}
