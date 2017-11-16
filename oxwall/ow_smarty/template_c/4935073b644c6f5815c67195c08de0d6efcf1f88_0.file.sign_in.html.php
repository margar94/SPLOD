<?php
/* Smarty version 3.1.29, created on 2017-11-16 01:11:19
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\sign_in.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0d5637be5cf3_94544356',
  'file_dependency' => 
  array (
    '4935073b644c6f5815c67195c08de0d6efcf1f88' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\sign_in.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0d5637be5cf3_94544356 ($_smarty_tpl) {
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
if (!is_callable('smarty_function_submit')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.submit.php';
if (!is_callable('smarty_function_label')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.label.php';
if (!is_callable('smarty_function_url_for_route')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.url_for_route.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
if (!is_callable('smarty_function_component')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.component.php';
?>
<div class="ow_sign_in_wrap">
<h2><?php echo $_smarty_tpl->tpl_vars['siteName']->value;?>
</h2>
<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>'sign-in')); $_block_repeat=true; echo smarty_block_form(array('name'=>'sign-in'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

     <div class="clearfix">
        <div class="ow_sign_in">
            <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>'box','langLabel'=>'base+base_sign_in_cap_label')); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>'box','langLabel'=>'base+base_sign_in_cap_label'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


                <div class="ow_user_name">
                    <?php echo smarty_function_input(array('name'=>'identity'),$_smarty_tpl);?>

                </div>
                <div class="ow_password">
                    <?php echo smarty_function_input(array('name'=>'password'),$_smarty_tpl);?>

                </div>
                <div class="ow_form_options clearfix">
                    <div class="ow_right">
                        <?php echo smarty_function_submit(array('name'=>'submit','class'=>'ow_positive'),$_smarty_tpl);?>

                    </div>
                    <p class="ow_remember_me"><?php echo smarty_function_input(array('name'=>'remember'),$_smarty_tpl);
echo smarty_function_label(array('name'=>'remember'),$_smarty_tpl);?>
</p>
                    <p class="ow_forgot_pass"><a href="<?php echo smarty_function_url_for_route(array('for'=>'base_forgot_password'),$_smarty_tpl);?>
"><?php echo smarty_function_text(array('key'=>'base+forgot_password_label'),$_smarty_tpl);?>
</a></p>
                </div>
            <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>'box','langLabel'=>'base+base_sign_in_cap_label'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

            <div class="ow_connect_buttons">
                <?php echo smarty_function_component(array('class'=>'BASE_CMP_SignInButtonList'),$_smarty_tpl);?>

            </div>
        </div>
        <div class="ow_sign_up">
            <p><?php echo smarty_function_text(array('key'=>'base+base_sign_in_txt'),$_smarty_tpl);?>
</p>
            <hr>
            <p> <a href="<?php echo $_smarty_tpl->tpl_vars['joinUrl']->value;?>
"><?php echo smarty_function_text(array('key'=>'base+join_submit_button_join'),$_smarty_tpl);?>
</a></p>
        </div>
     </div>
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>'sign-in'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

</div><?php }
}
