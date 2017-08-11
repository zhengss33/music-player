<template lang="html">
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" v-model="query" :placeholder="placeholder" class="box"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
  import { debounce } from 'common/js/utils';

  export default {
    data() {
      return {
        query: '',
      };
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手',
      },
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('queryChange', newQuery);
      }, 200));
    },
    methods: {
      clear() {
        this.query = '';
      },
      setQuery(query) {
        this.query = query;
      },
      blur() {
        this.$refs.input.blur();
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    width: 100%
    height: 40px
    padding: 0 6px
    box-sizing: border-box
    border-radius: 6px
    background: $color-highlight-background
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      font-size: $font-size-medium
      line-height: 20px
      color: $color-text
      background: $color-highlight-background
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
