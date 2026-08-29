export interface MenuItem {
  label?: string
  heading?: string
  icon?: string
  to?: { name: string }
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
    {
    heading: 'Accesos',
  },
  {
    label: 'Roles y permisos',
    icon: 'pi pi-lock',
    to: { name: 'role-permissions' },
  },
  {
    label: 'Usuarios',
    icon: 'pi pi-users',
  },
  {
    label: 'Configuraciones',
    icon: 'pi pi-cog',
    children: [
      { label: 'Sucursales' },
      { label: 'Almacenes' },
      { label: 'Categorías' },
      { label: 'Proveedores' },
      { label: 'Unidades' },
    ],
  },
  {
    heading: 'Comercial',
  },
  {
    label: 'Productos',
    icon: 'pi pi-box',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Clientes',
    icon: 'pi pi-user-plus',
  },
  {
    label: 'Ventas',
    icon: 'pi pi-dollar',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Devolución',
    icon: 'pi pi-replay',
  },
  {
    heading: 'Almacén',
  },
  {
    label: 'Compras',
    icon: 'pi pi-shopping-cart',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Transporte',
    icon: 'pi pi-truck',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Conversión',
    icon: 'pi pi-sync',
  },
  {
    label: 'Kardex',
    icon: 'pi pi-book',
    },
]