import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DataTeacher from '../views/componentt/DataTeacher.vue'
import Login from '../views/componentt/Login.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/Teacher',
    name: 'Teacher',
    component: DataTeacher
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Students',
    name: 'Students',
    //component:Students
  },
  {
    path: '/Parking',
    name: 'Parking',
  },
  {
    path: '/Guest',
    name: 'Guest',
  },
  {
    path: '/User',
    name: 'User',
    
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
