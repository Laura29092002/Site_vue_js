import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Rdf from '@/views/Rdf.vue';
import data from '@/views/Home.vue';

const routes = [
    {
        name: 'Home',
        path: '/home',
        component: Home,
        props: true,
    },
    {
        name: 'About',
        path: '/about',
        component: About,
        props: true,
    },
    {
        name: 'Rdf',
        path: '/rdf',
        component: Rdf,
        props: true,
    }
]


export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.push({ name: 'About', params: { data: data } })