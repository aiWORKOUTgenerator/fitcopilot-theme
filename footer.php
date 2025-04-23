    <footer id="colophon" class="site-footer">
        <div class="site-info">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <?php bloginfo('name'); ?>
            </a>
            <span class="sep"> | </span>
            <?php
            /* translators: 1: Current year. */
            printf(esc_html__('© %1$s', 'fitcopilot'), date_i18n('Y'));
            ?>
        </div><!-- .site-info -->
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html> 