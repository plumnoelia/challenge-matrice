<?php

namespace App\Services;

use App\Models\Server;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ServerService
{
    /**
     * Get all servers.
     *
     * @return Collection
     */
    public function getAllServers(): Collection
    {
        return Server::orderBy('order')->get();
    }

    /**
     * Get a server by ID.
     *
     * @param string $id
     * @return Server|null
     */
    public function getServerById(string $id): ?Server
    {
        return Server::find($id);
    }

    /**
     * Create a new server.
     *
     * @param array $data
     * @return Server
     */
    public function createServer(array $data): Server
    {
        if (!isset($data['order'])) {
           $data['order'] = Server::max('order') + 1;
        }
        return Server::create($data);
    }

    /**
     * Update an existing server.
     *
     * @param string $id
     * @param array $data
     * @return Server|null
     */
    public function updateServer(string $id, array $data): ?Server
    {
        $server = Server::find($id);

        if (!$server) {
            return null;
        }

        $server->update($data);

        return $server->fresh();
    }

    /**
     * Delete a server.
     *
     * @param string $id
     * @return bool
     */
    public function deleteServer(string $id): bool
    {
        $server = Server::find($id);

        if (!$server) {
            return false;
        }

        return $server->delete();
    }
}

