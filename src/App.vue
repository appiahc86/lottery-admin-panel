<script setup>
import { io }  from "socket.io-client";
import { ref, onMounted } from 'vue';
import Toast from "primevue/toast";
import Avatar from "primevue/avatar";
import  { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useHomeStore } from "@/store/home";
import axios from "@/axios";
window.toast = useToast();
const store = useHomeStore();
const router = useRouter();

const usersOnline = ref(0);
const smsLoading = ref(false);
const smsBalance = ref(null);
const profileSidebar = ref(false);

const socket = io(`${axios.defaults.baseURL}`);
window.socket = socket;
socket.emit('join-admin-users', 'admin');

socket.on("onlineUsers", (users) => {
  usersOnline.value = users
})

const getSmsBalance = async () => {
  try {
    smsLoading.value = true;
    const response = await axios.get('/admin/sms-balance')
    if (response.status === 200 ){
      smsBalance.value = response.data;
    }

  }catch (e) {
    console.clear();
  }finally { smsLoading.value = false; }
}

onMounted(() => {
  const sidebarToggler = document.querySelector("#menu-toggle");
  const wrapper = document.querySelector("#wrapper");
  sidebarToggler.onclick = (e) => {
    e.preventDefault();
    wrapper.classList.toggle("toggled");
  }

  getSmsBalance();
})

//Logout
const logout = () => {
  profileSidebar.value = false;
  store.clearToken();
  store.clearUser();
  router.push({name: 'login'});
  toast.add({severity:'success', summary: 'Success', detail: 'You are logged out', life: 4000});
}
</script>

<template>
<div id="wrapper">

<!-- Sidebar -->
<div id="sidebar-wrapper">
    <div class="sidebar-nav">
        <section class="sidebar-brand">
          <router-link :to="{name: 'dashboard'}"><span>&#127962;</span> Dashboard</router-link>
        </section>
        
        <section>
          <router-link :to="{name: 'home'}"><span>&#127968;</span> Home</router-link>
        </section>
         <section>
            <router-link :to="{name: 'client-users'}"><span>&#128101;</span> Users</router-link>
        </section>
<!--      <section>-->
<!--        <router-link :to="{name: 'current-tickets'}"><span>&#11088;</span> Today's Tickets</router-link>-->
<!--      </section>-->

      <section>
        <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#11088;</span>
            Tickets
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'current-tickets'}">
              <span class="pi pi-angle-double-down"></span>&nbsp; Today's Tickets</router-link></li>

            <li><router-link :to="{name: 'tomorrow-tickets'}">
              <span class="pi pi-angle-double-right"></span>&nbsp; Tomorrow's Tickets </router-link></li>

            <li><router-link :to="{name: 'search-tickets'}">
              <span class="pi pi-search-plus"></span>&nbsp; Search Daily Tickets </router-link></li>
            <hr>
            <li><router-link :to="{name: 'winners'}">
              <span class="pi pi-users"></span>&nbsp; Winnings </router-link></li>
          </ul>
        </div>
      </section>

        <section>
         <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#128248;</span>
            Images
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'images'}">
              <span class="pi pi-eye"></span>&nbsp; View Images</router-link></li>

            <li><router-link :to="{name: 'upload-images'}">
              <span class="pi pi-upload"></span>&nbsp; Upload Image </router-link></li>
          </ul>
        </div>
      </section>
      <section>
        <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#9989;</span>
            Draw
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'draw-numbers'}">
              <span class="pi pi-copy"></span>&nbsp; Enter Draw Numbers</router-link></li>

            <li><router-link :to="{name: 'draw'}">
              <span class="pi pi-calculator"></span>&nbsp; Perform Draw</router-link></li>
          </ul>
        </div>
      </section>

      <section>
        <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#128176;</span>
            Transactions
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'deposits'}">
              <span class="pi pi-copy"></span>&nbsp; Make Deposits</router-link></li>
            <li><router-link :to="{name: 'withdrawals'}">
              <span class="pi pi-copy"></span>&nbsp; Approve Withdrawals</router-link></li>
            <hr>
            <li><router-link :to="{name: 'view-deposits'}">
              <span class="pi pi-eye"></span>&nbsp; View Deposits</router-link></li>
            <li><router-link :to="{name: 'view-withdrawals'}">
              <span class="pi pi-eye"></span>&nbsp; View Withdrawals</router-link></li>
            <hr>
            <li><router-link :to="{name: 'search-transaction'}">
              <span class="pi pi-search"></span>&nbsp;Transaction Lookup</router-link></li>
          </ul>
        </div>
      </section>


      <!--   Settings   -->
      <section>
        <router-link :to="{name: 'settings'}"><span>&#128101;</span> Settings</router-link>
      </section>

      <!--   SMS   -->
      <div class=" text-white ms-3 mt-4">
        <h6>
          <span class="pi pi-envelope">&nbsp;</span>
          sms: {{ smsBalance }}
          <span class="pi pi-sync" style="cursor: pointer;" title="Refresh" @click="getSmsBalance" v-if="!smsLoading"></span>
          <span class="spinner-border spinner-border-sm" v-if="smsLoading"></span>
        </h6>
      </div>


      <div class="text-center dropdown mt-4">
        <span class="text-white" data-bs-toggle="dropdown" aria-expanded="false">
          <Avatar icon="pi pi-user" style="background-color:#2196F3; color: #ffffff; cursor: pointer;"
                  v-if="store.token" shape="circle" @click="profileSidebar = true;"
           />
          <span class="dropdown-toggle">&nbsp; {{ store.user.displayName || '' }}</span>
        </span>
        <ul class="dropdown-menu w-100">
          <li><router-link :to="{name: 'change-password'}" class="dropdown-item fw-bold" style="cursor: pointer;"><span>&#128274;</span>Reset Password</router-link></li>
          <li class="dropdown-divider"></li>
          <li><a class="dropdown-item fw-bold" @click="logout" style="cursor: pointer;"><span>&#9940;</span> Logout</a></li>
        </ul>
      </div>

    </div>
</div>
<!-- /#sidebar-wrapper -->

<!--Navbar-->
<nav class="navbar bg-light">
  <div class="container-fluid">
    <a class="navbar-brand py-0" style="cursor: pointer;" id="menu-toggle">
      <h3 class="pi pi-bars"></h3>
    </a>

    <!--   Online users   -->
    <div class="justify-content-center mx-auto">
      <div class="navbar-nav">
        <a class="nav-link fw-bold">
          Users Online: {{ usersOnline }}
        </a>
      </div>
    </div>

  </div>
</nav>

<!-- Page Content -->

<div class="px-2">
  <router-view></router-view>
</div>


</div>
<!-- /#wrapper -->

  <Toast position="center" style="padding: 0;" class="my-toast"/>
</template>

<style scoped>

.my-toast {
  font-size: 0.5em !important;
}
body {
    overflow-x: hidden;
 }
.dropdown-toggle {
  cursor: pointer;
}
 .router-link-exact-active {
  color: #9af803 !important;
   font-weight: bold;
  background: none !important;
 }

/* Toggle Styles */

#wrapper {
    padding-left: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled {
    padding-left: 250px;
}

#sidebar-wrapper {
    z-index: 1000;
    position: fixed;
    left: 250px;
    width: 0;
    height: 100%;
    margin-left: -250px;
    overflow-y: auto;
    background: #000;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled #sidebar-wrapper {
    width: 250px;
}

#page-content-wrapper {
    width: 100%;
    position: absolute;
    padding: 15px;
}

#wrapper.toggled #page-content-wrapper {
    position: absolute;
    margin-right: -250px;
}

/* Sidebar Styles */

.sidebar-nav {
    position: absolute;
    top: 0;
    width: 250px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.sidebar-nav section {
    text-indent: 10px;
    line-height: 50px;
}

.sidebar-nav section a {
    display: block;
    text-decoration: none;
    color: #fff3cd;
    font-weight: bold;
  letter-spacing: 0.8px;
}

.sidebar-nav section a:hover {
    text-decoration: none;
    color: #f5d2ae;
    background: rgba(255,255,255,0.2);
}

.sidebar-nav section a:active,
.sidebar-nav section a:focus {
    text-decoration: none;
}

.sidebar-nav > .sidebar-brand {
    height: 65px;
    font-size: 18px;
    line-height: 60px;
}

.sidebar-nav > .sidebar-brand a {
    color: #999999;
}

.sidebar-nav > .sidebar-brand a:hover {
    color: #fff;
    background: none;
}

@media(min-width:768px) {
    #wrapper {
        padding-left: 250px;
    }

    #wrapper.toggled {
        padding-left: 0;
    }

    #sidebar-wrapper {
        width: 250px;
    }

    #wrapper.toggled #sidebar-wrapper {
        width: 0;
    }

    #page-content-wrapper {
        padding: 20px;
        position: relative;
    }

    #wrapper.toggled #page-content-wrapper {
        position: relative;
        margin-right: 0;
    }
}
</style>
