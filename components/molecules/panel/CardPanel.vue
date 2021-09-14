<template>
  <div class="col s12">
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <h4 class="card-title"><slot name="title" /></h4>
            <div class="row">
              <div class="col s12">
                <slot name="body" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
