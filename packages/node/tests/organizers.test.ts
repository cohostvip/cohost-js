import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizersAPI } from '../src/api/organizers';
import { RequestFn } from '../src/http/request';

describe('OrganizersAPI', () => {
  const mockRequest: RequestFn = vi.fn();
  const settings = { debug: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls /organizers and unwraps the organizers array for list()', async () => {
    const organizers = [{ id: 'org-1', name: 'Acme' }, { id: 'org-2', name: 'Globex' }];
    (mockRequest as any).mockResolvedValue({ organizers });

    const api = new OrganizersAPI(mockRequest, settings);
    const result = await api.list();

    expect(mockRequest).toHaveBeenCalledWith('/organizers');
    expect(result).toEqual(organizers);
  });

  it('calls /organizers/:id and unwraps the organizer for fetch()', async () => {
    const organizer = { id: 'org-1', name: 'Acme' };
    (mockRequest as any).mockResolvedValue({ organizer });

    const api = new OrganizersAPI(mockRequest, settings);
    const result = await api.fetch('org-1');

    expect(mockRequest).toHaveBeenCalledWith('/organizers/org-1');
    expect(result).toEqual(organizer);
  });

  it('POSTs /organizers with a wrapped body and unwraps the result for create()', async () => {
    const organizer = { id: 'org-3', name: 'Acme Events' };
    (mockRequest as any).mockResolvedValue({ organizer });

    const api = new OrganizersAPI(mockRequest, settings);
    const result = await api.create({ name: 'Acme Events' });

    expect(mockRequest).toHaveBeenCalledWith('/organizers', {
      method: 'POST',
      data: { organizer: { name: 'Acme Events' } },
    });
    expect(result).toEqual(organizer);
  });

  it('PATCHes /organizers/:id with a wrapped body and unwraps the result for update()', async () => {
    const organizer = { id: 'org-1', name: 'Acme Events' };
    (mockRequest as any).mockResolvedValue({ organizer });

    const api = new OrganizersAPI(mockRequest, settings);
    const result = await api.update('org-1', { name: 'Acme Events', bio: 'Live events.' });

    expect(mockRequest).toHaveBeenCalledWith('/organizers/org-1', {
      method: 'PATCH',
      data: { organizer: { name: 'Acme Events', bio: 'Live events.' } },
    });
    expect(result).toEqual(organizer);
  });

  it('DELETEs /organizers/:id for delete()', async () => {
    (mockRequest as any).mockResolvedValue(null);

    const api = new OrganizersAPI(mockRequest, settings);
    await api.delete('org-1');

    expect(mockRequest).toHaveBeenCalledWith('/organizers/org-1', {
      method: 'DELETE',
    });
  });
});
