import { DataProvider } from 'react-admin';

const API_URL = 'http://localhost:3000'; // Update this to match your backend URL

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = {
      page: page,
      limit: perPage,
      sort: field,
      order: order
    };
    
    const url = `${API_URL}/${resource}?${new URLSearchParams(query as any)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      data: data.data || data,
      total: data.total || data.length,
    };
  },

  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`);
    const data = await response.json();
    return {
      data: data.data || data,
    };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id => fetch(`${API_URL}/${resource}/${id}`))
    );
    const data = await Promise.all(responses.map(response => response.json()));
    return {
      data: data.map(item => item.data || item),
    };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = {
      page: page,
      limit: perPage,
      sort: field,
      order: order,
      [params.target]: params.id,
    };
    
    const url = `${API_URL}/${resource}?${new URLSearchParams(query as any)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      data: data.data || data,
      total: data.total || data.length,
    };
  },

  create: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.data),
    });
    const data = await response.json();
    return {
      data: data.data || data,
    };
  },

  update: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.data),
    });
    const data = await response.json();
    return {
      data: data.data || data,
    };
  },

  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params.data),
        })
      )
    );
    await Promise.all(responses.map(response => response.json()));
    return {
      data: params.ids,
    };
  },

  delete: async (resource, params) => {
    await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE',
    });
    return {
      data: params.previousData || {} as any,
    };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'DELETE',
        })
      )
    );
    return {
      data: params.ids,
    };
  },
}; 