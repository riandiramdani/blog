<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="miniVariant"
    :clipped="false"
    fixed
    app
  >
    <perfect-scrollbar>
      <v-list dense expand>
        <template v-for="(item, i) in menus">
          <!--group with subitems-->
          <v-list-group
            v-if="item.items"
            :key="item.name"
            :group="item.group"
            :prepend-icon="item.icon"
            no-action="no-action"
            color="red accent-3"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <template v-for="(subItem, i) in item.items">
              <!-- Sub Group -->
              <v-list-group
                v-if="subItem.items"
                :key="subItem.name"
                :group="subItem.group"
                color="red accent-3"
              >
                <v-list-item v-slot:activator ripple="ripple">
                  <v-list-item-content>
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="(grand, i) in subItem.children"
                  :key="i"
                  :to="grand.href ? grand.href : null"
                  ripple="ripple"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ grand.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <!--child item-->
              <v-list-item
                v-else
                :key="i"
                :to="subItem.href ? subItem.href : null"
                :disabled="subItem.disabled"
                :target="subItem.target"
                ripple="ripple"
              >
                <v-list-item-content>
                  <v-list-item-title><span>{{ subItem.title }}</span></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="subItem.action">
                  <v-icon :class="[subItem.actionClass || 'success--text']">{{ subItem.action }}</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list-group>

          <!-- Header -->
          <v-subheader v-else-if="item.header" :key="i">{{ item.header }}</v-subheader>
          <v-divider v-else-if="item.divider" :key="i"></v-divider>

          <!-- Top Level Link -->
          <v-list-item
            v-else
            :to="item.href ? item.href : null"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
            :key="item.name"
            color="red accent-3"
            dense
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="item.subAction">
              <v-icon class="success--text">{{ item.subAction }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
        <!-- <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import menu from '@/api/menu';
import { PerfectScrollbar } from 'vue2-perfect-scrollbar';

export default {
  name: 'app-drawer',
  components: { PerfectScrollbar },
  data() {
    return {
      menus: menu,
      // items: [
      //   {
      //     icon: 'mdi-apps',
      //     title: 'Welcome',
      //     to: '/'
      //   },
      //   {
      //     icon: 'mdi-chart-bubble',
      //     title: 'Inspire',
      //     to: '/inspire'
      //   }
      // ]
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('drawer', val)
      }
    },
    miniVariant: {
      get() {
        return this.$store.state.miniVariant
      },
      set(val) {
        this.$store.commit('miniVariant', val)
      }
    },
    computeGroupActive() {
      return true;
    },
    sideToolbarColor() {
      return this.$vuetify.options.extra.sideNav;
    }
  },
}
</script>

<style src=""/>
