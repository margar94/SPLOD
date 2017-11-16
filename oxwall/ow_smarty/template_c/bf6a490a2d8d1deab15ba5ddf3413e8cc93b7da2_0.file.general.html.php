<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:51
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_themes\simplicity\master_pages\general.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b7434526_21912407',
  'file_dependency' => 
  array (
    'bf6a490a2d8d1deab15ba5ddf3413e8cc93b7da2' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_themes\\simplicity\\master_pages\\general.html',
      1 => 1470306120,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b7434526_21912407 ($_smarty_tpl) {
if (!is_callable('smarty_function_component')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.component.php';
if (!is_callable('smarty_function_add_content')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.add_content.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
if (!is_callable('smarty_function_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.decorator.php';
?>
<div class="ow_page_wrap">
	<div class="ow_menu_fullpage">
		<div class="ow_menu_fullpage_wrap"><?php echo $_smarty_tpl->tpl_vars['main_menu']->value;?>
</div>
	</div>
	<div class="ow_site_panel clearfix">
			<a class="ow_logo ow_left" href="<?php echo $_smarty_tpl->tpl_vars['siteUrl']->value;?>
"></a>
			<div class="ow_nav_btn"></div>
			<div class="ow_console_right">
				<?php echo smarty_function_component(array('class'=>'BASE_CMP_Console'),$_smarty_tpl);?>

			</div>
			<div class="ow_menu_wrap"><?php echo smarty_function_component(array('class'=>'BASE_CMP_MainMenu','responsive'=>true),$_smarty_tpl);?>
</div>
	</div>
	<div class="ow_header">
        <div class="ow_header_pic"></div>
	</div>
	
	<div class="ow_page_padding">
		<div class="ow_page_container">
			<div class="ow_canvas">
				<div class="ow_page ow_bg_color clearfix">
					<?php if (!empty($_smarty_tpl->tpl_vars['heading']->value)) {?><h1 class="ow_stdmargin <?php echo $_smarty_tpl->tpl_vars['heading_icon_class']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['heading']->value;?>
</h1><?php }?>
					<div class="ow_content">
						<?php echo smarty_function_add_content(array('key'=>'base.add_page_top_content'),$_smarty_tpl);?>

						<?php echo $_smarty_tpl->tpl_vars['content']->value;?>

						<?php echo smarty_function_add_content(array('key'=>'base.add_page_bottom_content'),$_smarty_tpl);?>

					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="ow_footer">
	<div class="ow_canvas">
		<div class="ow_page clearfix">
			<?php echo $_smarty_tpl->tpl_vars['bottom_menu']->value;?>

			<div class="ow_copyright">
				<?php echo smarty_function_text(array('key'=>'base+copyright'),$_smarty_tpl);?>

			</div>
			<div style="float:right;padding-bottom: 30px;">
				<?php echo $_smarty_tpl->tpl_vars['bottomPoweredByLink']->value;?>

			</div>
		</div>
	</div>
</div>    
<?php echo smarty_function_decorator(array('name'=>'floatbox'),$_smarty_tpl);?>

<?php echo '<script'; ?>
 type="text/javascript">
	$(window).scroll(function() {
	var $menuwrappos = $('.ow_menu_wrap').offset().top;
    if ($(this).scrollTop() > $menuwrappos) { 
        $('.ow_page_wrap').addClass('ow_hidden_menu');
    }
    else {
    	$('.ow_page_wrap').removeClass('ow_hidden_menu');
    }
	});
	$('.ow_nav_btn').click(function() {
    	if ($('body').hasClass('ow_menu_active')) {
    		$('body').removeClass('ow_menu_active');
    	}
    	else {
    		$('body').addClass('ow_menu_active');
    	}
    })
    $('.ow_menu_fullpage_wrap a').click(function() {
    	$('body').removeClass('ow_menu_active');
    })
<?php echo '</script'; ?>
><?php }
}
