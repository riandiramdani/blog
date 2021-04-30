const apiFactory = axios => ({
  // Auth
  login(email, password) {
    return axios.post('/auth/login', {
      email: email,
      password: password,
    });
  },
  logout() {
    return axios.post('/auth/logout')
  },
  refreshToken() {
    return axios.post('/auth/refresh')
  },
  getUserInfo() {
    return axios.get('/auth/user-data')
  },
  register(formData) {
    return axios.post('/auth/register', formData)
  },
  emailVerify(formData) {
    return axios.post('/auth/register/email-verify', formData)
  },
  passwordResetGetEmail(formData) {
    return axios.post('/auth/password-reset', formData)
  },
  passwordResetProcess(formData, uriSegment) {
    return axios.post(
      '/auth/password-reset/'+uriSegment.user+'/'+uriSegment.key,
      formData
    )
  },

  // Categories
  getCategoryList() {
    return axios.get('/category')
  },
  getArticlesByCategory(categoryId, page = 1) {
    return axios.get('/category/' + categoryId, { params: { page: page}})
  },
  getPopularArticlesByCategory(categoryId) {
    return axios.get('/category/popular/' + categoryId)
  },
  getPopularCategoriesArticles() {
    return axios.get('/category/popular/all')
  },

  // tags
  getArticlesByTag(tagId, page = 1) {
    return axios.get('/tag/' + tagId, { params: { page: page}})
  },
  getPopularArticlesByTag(tagId) {
    return axios.get('/tag/popular/' + tagId)
  },

  // author
  getArticlesByAuthor(username, page = 1) {
    return axios.get('/author/' + username, { params: { page: page}})
  },

  // Article
  go(view_form_data, visitorIp) {
    return axios.post('/article/go', {
      view_form_data: view_form_data,
      //g-recaptcha-response:null,
      cookies: { visitor: visitorIp },
    });
  },
  getArticle(id, referer = null) {
    if (referer === null){
      return axios.get('/article/' + id)
    }
    return axios.get('/article/' + id + '/' + referer)
  },
  getPopularArticles(page = 1, perPage = 5) {
    return axios.get('/article/popular', { params: {page: page, per_page: perPage  }})
  },
  getArticleComments(id, page = 1) {
    return axios.get('/article/comments/' + id, { params: { page: page}})
  },
  addArticleComment(id, content) {
    return axios.post('/article/comment/store', {
      article_id: id,
      content: content
    })
  },
  addArticleCommentReply(id, parent_id, content) {
    return axios.post('/article/reply/store', {
      article_id: id,
      parent_id: parent_id,
      content: content
    })
  },
  processArticleLike(articleId) {
    return axios.post('/article/like/' + articleId)
  },
  processAuthorFollow(username) {
    return axios.post('/author/' + username + '/follow')
  },
  processAuthorUnfollow(username) {
    return axios.post('/author/' + username + '/unFollow')
  },

  search(formData) {
    return axios.get('/search', { params: formData })
  },

  // Home Page
  getSiteOptions() {
    return axios.get('/site/options')
  },

  getPage(slug) {
    return axios.get('/page/' + slug)
  },

  /**************************************************
   * ADMIN & MEMBER
   **************************************************/
  processArticleBookmark(articleId) {
    return axios.post('/member/articles/bookmark/' + articleId)
  },
  getBookmarkArticles(page) {
    return axios.get('/member/articles/bookmarks', { params: { page: page}})
  },

  //  Categories
  adminGetCategories() {
    return axios.get('/admin/categories')
  },
  adminStoreCategory(formData) {
    return axios.post('/admin/categories/store', formData)
  },
  adminUpdateCategory(formData, categoryId) {
    return axios.post('/admin/categories/' + categoryId + '/update', formData)
  },
  adminFetchCategory(categoryId) {
    return axios.get('/admin/categories/' + categoryId + '/edit')
  },
  adminDeleteCategory(categoryId) {
    return axios.post('/admin/categories/' + categoryId + '/destroy')
  },

  //  Tags
  adminGetTags(reqParams) {
    return axios.get('/admin/tags', { params: reqParams })
  },
  adminStoreTag(formData) {
    return axios.post('/admin/tags/store', formData)
  },
  adminUpdateTag(formData, tagId) {
    return axios.post('/admin/tags/' + tagId + '/update', formData)
  },
  adminFetchTag(tagId) {
    return axios.get('/admin/tags/' + tagId + '/edit')
  },
  adminDeleteTag(tagd) {
    return axios.post('/admin/tags/' + tagd + '/destroy')
  },

  // Comments
  adminGetComments(page, order, dir) {
    return axios.get('/admin/comments', { params: { page: page, order: order, dir: dir }})
  },
  adminUpdateComment(formData, commentId) {
    return axios.post('/admin/comments/' + commentId + '/update', formData)
  },
  adminFetchComment(commentId) {
    return axios.get('/admin/comments/' + commentId + '/edit')
  },
  adminDeleteComment(commentId) {
    return axios.post('/admin/comments/' + commentId + '/destroy')
  },

  //  Articles
  adminGetArticles(reqParams) {
    return axios.get('/admin/articles', { params: reqParams })
  },
  adminCreateArticle() {
    return axios.get('/admin/articles/create')
  },
  adminStoreArticle(formData) {
    return axios.post('/admin/articles/store', formData)
  },
  adminUpdateArticle(formData, articleId) {
    return axios.post('/admin/articles/' + articleId + '/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  adminFetchArticle(articleId) {
    return axios.get('/admin/articles/' + articleId + '/edit')
  },
  adminDeleteArticle(articleId) {
    return axios.post('/admin/articles/' + articleId + '/destroy')
  },
  // New Pending
  adminGetNewPendingArticles(reqParams) {
    return axios.get('/admin/articles/index/new-pending', { params: reqParams })
  },
  adminFetchNewPendingArticle(articleId) {
    return axios.get('/admin/articles/' + articleId + '/new-pending/edit')
  },
  adminNewPendingProccess(formData, articleId) {
    return axios.post('/admin/articles/' + articleId + '/new-pending/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // Update Pending
  adminGetUpdatePendingArticles(reqParams) {
    return axios.get('/admin/articles/index/update-pending', { params: reqParams })
  },
  adminFetchUpdatePendingArticle(articleId) {
    return axios.get('/admin/articles/' + articleId + '/update-pending/edit')
  },
  adminUpdatePendingProccess(formData, articleId) {
    return axios.post('/admin/articles/' + articleId + '/update-pending/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // FILES
  imageUploader(file) {
    var formData = new FormData();
    formData.append("file", file);

    return axios.post('/files/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  adminGetFiles(queryParams) {
    return axios.get('/admin/files', { params: queryParams })
  },
  adminStoreFile(file) {
    var formData = new FormData();
    formData.append("file", file);

    return axios.post('/admin/files/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  adminUpdateFile(formData, fileId) {
    return axios.post('/admin/files/' + fileId + '/update', formData)
  },
  adminFetchFile(fileId) {
    return axios.get('/admin/files/' + fileId + '/edit')
  },
  adminDeleteFile(fileId) {
    return axios.post('/admin/files/' + fileId + '/destroy')
  },

  // Users
  adminGetReferralUser(queryParams) {
    return axios.get('/admin/users/referrals', { params: queryParams })
  },
  adminGetUsers(queryParams) {
    return axios.get('/admin/users', { params: queryParams })
  },
  adminStoreUser(formData) {
    return axios.post('/admin/users/store', formData,)
  },
  adminUpdateUser(formData, userId) {
    return axios.post('/admin/users/' + userId + '/update', formData)
  },
  adminFetchUser(userId) {
    return axios.get('/admin/users/' + userId + '/edit')
  },
  adminDeleteUser(userId) {
    return axios.post('/admin/users/' + userId + '/destroy')
  },

  // PAGES
  adminGetPages(reqParams) {
    return axios.get('/admin/pages', { params: reqParams })
  },
  adminFetchPage(pageId) {
    return axios.get('/admin/pages/'+pageId+'/edit')
  },
  adminUpdatePage(formData, pageId) {
    return axios.post('/admin/pages/' + pageId + '/update', formData)
  },

  // Options
  adminGetOptions() {
    return axios.get('/admin/options')
  },
  saveSettings(formData)  {
    return axios.post('/admin/options', formData)
  },

  // Stats
  getAdminStatistics(month) {
    return axios.get('/admin/statistics', { params: { month: month}})
  },

  /*******************************************************
   * MEMBER
   ******************************************************/
  // Stats
  getMemberStatistics(month) {
    return axios.get('/member/statistics', { params: { month: month}})
  },
  //  Articles
  memberGetArticles(reqParams) {
    return axios.get('/member/articles', { params: reqParams })
  },
  memberCreateArticle() {
    return axios.get('/member/articles/create')
  },
  memberStoreArticle(formData) {
    return axios.post('/member/articles/store', formData)
  },
  memberUpdateArticle(formData, articleId) {
    return axios.post('/member/articles/' + articleId + '/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  memberFetchArticle(articleId) {
    return axios.get('/member/articles/' + articleId + '/edit')
  },
  memberDeleteArticle(articleId) {
    return axios.post('/member/articles/' + articleId + '/destroy')
  },

  // user
  memberGetReferralUser(queryParams) {
    return axios.get('/member/referrals', { params: queryParams })
  },
  memberGetFeeds(queryParams) {
    return axios.get('/member/feed', { params: queryParams })
  },
  memberFetchUser() {
    return axios.get('/member/settings')
  },
  memberUpdateSettings(formData) {
    return axios.post('/member/settings', formData)
  },
  memberUpdatePassword(formData) {
    return axios.post('/member/password-change', formData)
  },
  memberSetUsername(formData) {
    return axios.post('/member/set-username', formData)
  },

  getAllNotifications(page) {
    return axios.get('/member/notifications', { params: { page: page}})
  },
  getUnreadNotifications(page) {
    return axios.get('/member/notifications/unread', { params: { page: page}})
  },
  markNotificationAsRead(notificationId) {
    return axios.post('/member/notifications/mark-notification-read/'+notificationId)
  },

  // Stats
  getMemberStatistics(month) {
    return axios.get('/member/statistics', { params: { month: month}})
  }
})




/*
** Executed by ~/.nuxt/index.js with context given
** This method can be asynchronous
*/
export default ({ $axios }, inject) => {
  // Inject `api` key
  // -> app.$api
  // -> this.$api in vue components
  // -> this.$api in store actions/mutations
  const api = apiFactory($axios)
  inject("api", api)
}
