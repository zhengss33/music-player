<template lang="html">
  <div class="search-list">
    <ul>
      <li class="search-item" @click.stop="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: [],
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    deleteItem(item) {
      this.$emit('delete', item);
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      .text
        flex: 1
        color: $color-text-l
        font-size: $font-size-medium
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
