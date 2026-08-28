<template>
  <section class="dashboard-page">
    <div class="dashboard-intro">
      <div>
        <p class="dashboard-kicker">Vista general</p>
        <h1>Dashboard</h1>
        <p>Supervisa la actividad de tu inventario desde un único lugar.</p>
      </div>
      <span class="dashboard-date">Operación actual</span>
    </div>

    <div class="dashboard-grid">
      <article class="dashboard-card dashboard-card-primary">
        <span class="dashboard-card-label">Inventario</span>
        <strong>0</strong>
        <p>Productos registrados</p>
      </article>

      <article class="dashboard-card">
        <span class="dashboard-card-label">Movimientos</span>
        <strong>0</strong>
        <p>Operaciones hoy</p>
      </article>

      <article class="dashboard-card">
        <span class="dashboard-card-label">Alertas</span>
        <strong>0</strong>
        <p>Productos por revisar</p>
      </article>
    </div>

    <section class="dashboard-empty-state">
      <i class="pi pi-chart-bar" aria-hidden="true" />
      <h2>Tu panel está listo</h2>
      <p>Agrega módulos al menú lateral para empezar a gestionar productos, movimientos y reportes.</p>
    </section>
  </section>
</template>
