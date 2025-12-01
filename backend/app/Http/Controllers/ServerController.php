<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateServerRequest;
use App\Http\Requests\UpdateServerRequest;
use App\Http\Resources\ServerResource;
use App\Services\ServerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    protected ServerService $serverService;

    public function __construct(ServerService $serverService)
    {
        $this->serverService = $serverService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $servers = $this->serverService->getAllServers();
        return response()->json(ServerResource::collection($servers));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateServerRequest $request): JsonResponse
    {
       {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('servers', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $server = $this->serverService->createServer($data);

        return response()->json(new ServerResource($server), 200);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $server = $this->serverService->getServerById($id);

        if (!$server) {
            return response()->json(['message' => 'Servidor no encontrado'], 404);
        }

        return response()->json(new ServerResource($server));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServerRequest $request, string $id): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('servers', 'public');
            $data['image'] = asset('storage/' . $path);
        }
        $server = $this->serverService->updateServer($id, $data);

        if (!$server) {
            return response()->json(['message' => 'Servidor no encontrado'], 404);
        }

        return response()->json(new ServerResource($server));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->serverService->deleteServer($id);

        if (!$deleted) {
            return response()->json(['message' => 'Servidor no encontrado'], 404);
        }

        return response()->json(['message' => 'Servidor eliminado correctamente'], 200);
    }

    /**
     * Reorder servers based on provided order.
     */
    public function reorder(Request $request)
    {
        $servers = $request->input('servers');

        if (!is_array($servers)) {
            return response()->json(['message' => 'Formato inválido'], 422);
        }

        foreach ($servers as $item) {
            if (!isset($item['id'], $item['order'])) continue;
            $server = $this->serverService->getServerById($item['id']);

            if (!$server) {
                \Log::warning("Server no encontrado: " . $item['id']);
                continue;
            }

            $server->order = $item['order'];
            $server->save();
        }

        return response()->json(['message' => 'Orden actualizado']);
    }

}
