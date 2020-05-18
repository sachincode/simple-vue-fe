<template>
  <div class="sim-doc-login-wrapper">
    <div class="login-block">
      <h1>Login</h1>
      <div class="username-wrapper input-wrapper">
        <input type="text"
               :class="usernameClass"
               :value="username"
               @input="onUsernameInput"
               @change="onUserNameChange"
               placeholder="Username"
               id="username"
        />
        <Icon class="icon" type="md-people"></Icon>
      </div>
      <div class="password-wrapper input-wrapper">
        <input type="password"
               :class="passwordClass"
               :value="password"
               @input="onPasswordInput"
               @change="onPasswordChange"
               placeholder="Password"
               id="password"
        />
        <Icon class="icon" type="md-unlock"></Icon>
      </div>
      <button @click="onSubmit">登录</button>
    </div>
  </div>
</template>
<script>
  import {login} from '../../api/sso';

  export default {
    data() {
      return {
        username: '',
        password: '',
        usernameClass: '',
        passwordClass: '',
      };
    },
    methods: {
      onSubmit() {

        if (!this.username && !this.password) {
          this.usernameClass = 'error';
          this.passwordClass = 'error';
          return;
        }

        if (!this.username) {
          this.usernameClass = 'error';
          return;
        }

        if (!this.password) {
          this.passwordClass = 'error';
          return;
        }

        login.post({
          username: this.username,
          password: this.password,
        }).then((data) => {
          window.location.reload();
        });
      },
      onUserNameChange(event) {
        this.username = event.target.value;
      },
      onPasswordChange(event) {
        this.password = event.target.value;
      },
      onUsernameInput() {
        this.usernameClass = '';
      },
      onPasswordInput() {
        this.usernameClass = '';
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
