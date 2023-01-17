<script setup>
import { ref, onMounted } from 'vue';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
window.toast = useToast();


onMounted(() => {
  const sidebarToggler = document.querySelector("#menu-toggle");
  const wrapper = document.querySelector("#wrapper");
  sidebarToggler.onclick = (e) => {
    e.preventDefault();
    wrapper.classList.toggle("toggled");
  }
})
</script>

<template>
<div id="wrapper">

<!-- Sidebar -->
<div id="sidebar-wrapper">
    <ul class="sidebar-nav">
        <li class="sidebar-brand">
          <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
        </li>
        
        <li>
          <router-link :to="{name: 'home'}">Home</router-link>
        </li>
         <li>
            <router-link :to="{name: 'client-users'}">Users</router-link>
        </li>
        <li>
         <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Images
          </a>
          <ul class="dropdown-menu dropdown-menu-dark">
            <li><router-link :to="{name: 'images'}">View Images</router-link></li>
            <li><router-link :to="{name: 'upload-images'}">Upload Image</router-link></li>
            <li><router-link :to="{name: 'arrange-images'}">Arrange Images</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Separated link</a></li>
          </ul>
        </div>
      </li>
    </ul>

</div>
<!-- /#sidebar-wrapper -->

<!--Navbar-->
<nav class="navbar bg-light">
  <div class="container-fluid">
    <a class="navbar-brand py-0" style="cursor: pointer;" id="menu-toggle">
      <h3 class="pi pi-bars"></h3>
    </a>
  </div>
</nav>

<!-- Page Content -->

<div class="px-2">
  <router-view></router-view>
</div>

<!-- /#page-content-wrapper -->


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
  color: #fff !important;
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

.sidebar-nav li {
    text-indent: 20px;
    line-height: 40px;
}

.sidebar-nav li a {
    display: block;
    text-decoration: none;
    color: #999999;
}

.sidebar-nav li a:hover {
    text-decoration: none;
    color: #fff;
    background: rgba(255,255,255,0.2);
}

.sidebar-nav li a:active,
.sidebar-nav li a:focus {
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
