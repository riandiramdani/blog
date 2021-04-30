const Menu = [
  {header: 'Apps'},
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'mdi-view-dashboard-outline',
    name: 'Dashboard',
    href: '/admin/dashboard'
  },
  {
    title: 'Articles',
    group: 'articles',
    icon: 'mdi-file-multiple-outline',
    items: [
      {name: 'list', title: 'List', href: '/admin/articles/list'},
      {name: 'new-pending', title: 'New Pending', href: '/admin/articles/new-pending'},
      {name: 'update-pending', title: 'Update Pending', href: '/admin/articles/update-pending'},
    ]
  },
  {
    title: 'Comments',
    group: 'comments',
    icon: 'mdi-chat-outline',
    name: 'comments',
    href: '/admin/comments'
  },
  {
    title: 'Categories',
    group: 'category',
    icon: 'mdi-buffer',
    name: 'categories',
    href: '/admin/categories'
  },
  {
    title: 'Tags',
    group: 'tags',
    icon: 'mdi-tag-multiple',
    name: 'tags',
    href: '/admin/tags'
  },
  {
    title: 'Pages',
    group: 'page',
    icon: 'mdi-book-open-outline',
    name: 'Pages',
    href: '/admin/pages/list'
  },
  {
    title: 'Files',
    group: 'files',
    icon: 'mdi-folder-multiple-image',
    name: 'Files',
    href: '/admin/files'
  },
  {
    title: 'Users',
    group: 'users',
    icon: 'mdi-account-circle-outline',
    items: [
      {name: 'list', title: 'List', href: '/admin/users/list'},
      {name: 'add-user', title: 'Add User', href: '/admin/users/add'},
      {name: 'refferals', title: 'User Refferals', href: '/admin/users/refferals'},
    ]
  },
  {
    title: 'Settings',
    group: 'setting',
    icon: 'mdi-cogs',
    name: 'Settings',
    href: '/admin/options'
  },
  {header: 'External Resource'},
  {
    title: 'Member Area',
    group: 'external-resources',
    icon: 'mdi-account-arrow-right-outline',
    name: 'Member Area',
    href: '/member'
  },
  {
    title: 'Blog Home Page',
    group: 'external-resources',
    icon: 'mdi-home-variant-outline',
    name: 'Home Page',
    href: '/'
  },
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
