<template>
  <div>
    <div class="imp-home">
      <div class="nav-container">
        <q-btn to="/payments/payment">결제</q-btn>
        <q-btn to="/payments/certification">본인인증</q-btn>
      </div>
    </div>
  </div>
  <div class="col-8">
    <router-view />
  </div>
</template>

<style>
.exp-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  * {
    color: #fff;
  }
}

.imp-home {
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      color: #344e81;
      box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.13);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: #fff;
      margin: 0 10px;
      width: 200px;
      height: 150px;
      border-radius: 3px;
      font-size: 18px;
      .anticon {
        margin-bottom: 20px;
        font-size: 40px;
      }
    }
  }
}
</style>
