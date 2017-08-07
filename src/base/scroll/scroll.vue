<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import BSrcoll from 'better-scroll';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1,
      },
      click: {
        type: Boolean,
        default: true,
      },
      data: {
        type: Array,
        default: null,
      },
      listenScroll: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll();
      });
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return;
        }
        this.scroll = new BSrcoll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos);
          });
        }
      },
      refresh() {
        if (this.scroll) {
          this.scroll.refresh();
        }
      },
      /* eslint-disable */
      scrollTo() {
        if (this.scroll) {
          this.scroll.scrollTo.apply(this.scroll, arguments);
        }
      },
      /* eslint-disable */
      scrollToElement(...args) {
        if (this.scroll) {
          this.scroll.scrollToElement(...args);
        }
      },
    },
    watch: {
      data() {
        this.$nextTick(() => {
          this.refresh();
        });
      },
    },
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus"></style>
