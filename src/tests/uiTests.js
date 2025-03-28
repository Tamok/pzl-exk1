export const tests = [
    {
      name: 'AdminPanel Render Check',
      category: 'UI',
      run: async () => {
        const root = document.getElementById('root');
        if (!root) throw new Error('App root not found');
        if (!root.innerText.includes('New Entry')) throw new Error('Admin tab not rendered');
        return 'AdminPanel visible';
      }
    }
  ];
  